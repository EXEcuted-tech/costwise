<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Prediction extends Model
{
    use  HasFactory;

    protected $table = 'predictions';
    protected $primaryKey = 'prediction_id';
    protected $keyType = 'int';
    public $incrementing = true;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'product_num',
        'product_name',
        'cost',
        'monthYear'
    ];

    public $timestamps = false;
}
