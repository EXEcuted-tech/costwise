<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $table = 'transactions';

    protected $primaryKey = 'transaction_id';

    protected $fillable = [
        'material_id',
        'fg_id',
        'journal',
        'entry_num',
        'trans_desc',
        'project',
        'gl_account',
        'gl_desc',
        'warehouse',
        'date',
        'month',
        'year',
        'settings'
    ];

    public $timestamps = false;
}
