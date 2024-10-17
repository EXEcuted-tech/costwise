<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BillOfMaterial extends Model
{
    protected $table = 'bill_of_materials';

    protected $primaryKey = 'bom_id';

    protected $fillable = [
        'formulations',
        // // Include 'fg_id' if Option 2 is chosen
        // 'fg_id',
    ];

    public $timestamps = true;

    // // Relationship to FinishedGoods (Option 2)
    // public function finishedGood()
    // {
    //     return $this->belongsTo(FinishedGoods::class, 'fg_id', 'fg_id');
    // }
}
