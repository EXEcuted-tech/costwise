<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Bom extends Model
{
    protected $table = 'bill_of_materials';

    protected $primaryKey = 'bom_id';

    protected $fillable = [
        'bom_name',
        'formulations',
    ];
}
