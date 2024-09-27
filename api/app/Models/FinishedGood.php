<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FinishedGood extends Model
{
    protected $table = 'finished_goods';

    protected $primaryKey = 'fg_id';

    protected $fillable = [
        'fodl_id',
        'fg_code',
        'fg_desc',
        'total_cost',
        'total_batch_qty',
        'rm_cost',
        'fg_price',
        'unit',
        'monthYear',
        'is_least_cost',
        // // Include 'bom_id' if Option 1 is chosen
        // 'bom_id',
    ];

    public $timestamps = false;

    public function fodl()
    {
        return $this->belongsTo(Fodl::class, 'fodl_id', 'fodl_id');
    }

    // // Relationship to BillOfMaterials (Option 1)
    // public function billOfMaterials()
    // {
    //     return $this->belongsTo(BillOfMaterials::class, 'bom_id', 'bom_id');
    // }
}
