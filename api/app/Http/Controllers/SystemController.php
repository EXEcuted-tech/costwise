<?php

namespace App\Http\Controllers;

use App\Models\File;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SystemController extends ApiController
{
    public function retrieveData()
    {
        $storageInfo = $this->getStorageInfo();
        $totalFiles = File::count();

        $fileTypes = File::select('file_type')
            ->selectRaw('COUNT(*) as count')
            ->groupBy('file_type')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->file_type => $item->count];
            });

        $this->status = 200;
        $this->response['storage'] = $storageInfo;
        $this->response['total_files'] = $totalFiles;
        $this->response['file_types'] = $fileTypes;
        return $this->getResponse();
    }

    private function getStorageInfo()
    {
        $databaseSize = $this->getDatabaseSize();
        $totalSpace = $databaseSize['total'];
        $usedSpace = $databaseSize['used'];
        $freeSpace = $totalSpace - $usedSpace;

        return [
            'total' => $this->formatBytes($totalSpace),
            'used' => $this->formatBytes($usedSpace),
            'free' => $this->formatBytes($freeSpace),
        ];
    }

    private function getDatabaseSize()
    {
        $dbName = config('database.connections.mysql.database');
        $result = \DB::select("SELECT 
            SUM(data_length + index_length) AS total_size,
            SUM(data_length) AS data_size,
            SUM(index_length) AS index_size
            FROM information_schema.TABLES 
            WHERE table_schema = ?", [$dbName]);

        $totalSize = $result[0]->total_size ?? 0;
        $dataSize = $result[0]->data_size ?? 0;

        return [
            'total' => $totalSize,
            'used' => $dataSize,
        ];
    }

    private function formatBytes($bytes, $precision = 2)
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];

        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);

        $bytes /= (1 << (10 * $pow));

        return round($bytes, $precision) . ' ' . $units[$pow];
    }
}

