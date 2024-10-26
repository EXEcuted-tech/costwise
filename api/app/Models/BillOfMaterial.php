<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BillOfMaterial extends Model
{
    protected $table = 'bill_of_materials';

    protected $primaryKey = 'bom_id';

    protected $fillable = [
        'formulations',
    ];

    public $timestamps = true;
}
