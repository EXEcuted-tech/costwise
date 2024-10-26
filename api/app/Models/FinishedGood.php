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
        'unit',
        'monthYear',
        'formulation_no',
        'is_least_cost',
    ];

    public $timestamps = false;

    public function fodl()
    {
        return $this->belongsTo(Fodl::class, 'fodl_id', 'fodl_id');
    }
}
