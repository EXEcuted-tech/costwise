<?php

return [
    'paths' => ['*'],  // This allows all routes
    'allowed_methods' => ['*'],  // Allows all HTTP methods
    'allowed_origins' => ['http://localhost:3000'],  // Replace with your frontend URL
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];