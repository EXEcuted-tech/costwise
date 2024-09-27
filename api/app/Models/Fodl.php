<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fodl extends Model
{
    use HasFactory;

    protected $table = 'fodl';

    protected $primaryKey = 'fodl_id';

    protected $fillable = [
        'factory_overhead',
        'direct_labor',
        'monthYear',
    ];

    // public function finishedGoods()
    // {
    //     return $this->hasMany(FinishedGood::class, 'fodl_id', 'fodl_id');
    // }
}
