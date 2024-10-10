<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    protected $table = 'inventory';

    protected $primaryKey = 'inventory_id';

    protected $fillable = [
        'material_id',
        'material_category',
        'stock_status',
        'purchased_qty',
        'usage_qty',
        'total_qty',
    ];

    public $timestamps = false;
}
