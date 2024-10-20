<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\File;
use Carbon\Carbon;
use App\Http\Controllers\FileController;

class ArchiveFiles extends Command
{
    protected $signature = 'files:archive-old';
    protected $description = 'Archive files older than 1 year';

    public function handle()
    {
        $oneYearAgo = Carbon::now()->subMinutes(5);
        
        $oldFiles = File::where('created_at', '<', $oneYearAgo)->get();
        
        $fileController = new FileController();
        
        foreach ($oldFiles as $file) {
            $request = new \Illuminate\Http\Request();
            $request->merge([
                'col' => 'file_id',
                'value' => $file->file_id
            ]);
            $fileController->delete($request);
            $this->info("Archived file: {$file->file_name}");
        }
        
        $this->info('Old file deletion completed.');
    }
}