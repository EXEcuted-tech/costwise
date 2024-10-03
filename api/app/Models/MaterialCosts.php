<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MaterialCosts extends Model
{
    use  HasFactory;
    //=====================
    //  Will Be Replaced
    //=====================

    protected $table = 'models';
    protected $primaryKey = 'model_id';
    protected $keyType = 'int';
    public $incrementing = true;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'model_name',
        'model_data',
        'created_at',
        'updated_at'
    ];
}
