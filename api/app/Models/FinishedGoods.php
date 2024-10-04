<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FinishedGoods extends Model
{
    use HasFactory;

    protected $table = 'finished_goods';
    protected $primaryKey = 'fg_id';
    protected $keyType = 'int';
    public $incrementing = true;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'fodl_id',
        'fg_code',
        'fg_desc',
        'cost',
        'monthYear'
    ];
}
