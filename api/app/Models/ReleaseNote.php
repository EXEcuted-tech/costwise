<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReleaseNote extends Model
{
    protected $table = 'release_notes';

    protected $primaryKey = 'note_id';

    protected $fillable = [
        'title',
        'version',
        'content',
        'user_id',
    ];

    protected $casts = [
        'content' => 'json',
    ];

    public $timestamps = true;

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
}
