<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class File extends Model
{
    use HasFactory;

    protected $table = 'files';
    protected $primaryKey = 'file_id';
    protected $keyType = 'int';
    public $incrementing = true;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'file_type',
        'settings',
        'created_at',
        'updated_at'
    ];
}
