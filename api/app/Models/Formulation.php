<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Formulation extends Model
{
    protected $table = 'formulations';

    protected $primaryKey = 'formulation_id';

    protected $fillable = [
        'fg_id',
        'formula_code',
        'emulsion',
        'material_qty_list',
    ];

    // protected $casts = [
    //     'emulsion' => 'array',
    //     'material_qty_list' => 'array',
    // ];
}
