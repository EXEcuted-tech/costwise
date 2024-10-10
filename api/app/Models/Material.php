<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Material extends Model
{
    protected $table = 'materials';

    protected $primaryKey = 'material_id';

    protected $fillable = [
        'material_code',
        'material_desc',
        'material_cost',
        'unit',
        'date',
    ];

    public $timestamps = false;
}
