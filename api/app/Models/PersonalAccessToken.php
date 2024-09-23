<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PersonalAccessToken extends Model
{
    use HasFactory;

    protected $table = 'personal_access_tokens';

    protected $casts = [
        'expires_at' => 'datetime',
    ];

    /**
     * Find the token by its plain-text value.
     *
     * @param string $token
     * @return PersonalAccessToken|null
     */
    public static function findToken($token)
    {
        [$id, $tokenValue] = explode('|', $token, 2);
        return self::where('token', hash('sha256', $tokenValue))->first();
    }

    public function tokenable()
    {
        return $this->morphTo();
    }
}
