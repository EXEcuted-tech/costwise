<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class UserController extends ApiController
{
    public function getCurrentUser()
    {
        $user = Auth::user();
        return response()->json($user);
    }

    public function getAllUsers()
    {
        $users = User::all();
        return response()->json($users);
    }

    public function updateUser(Request $request, $id)
    {
        Log::info('Updating user with ID: ' . $id);
        Log::info('Request data: ' . json_encode($request->all()));

        try {
            $user = User::findOrFail($id);

            Log::info('User found: ' . json_encode($user));

            $validator = Validator::make($request->all(), [
                'employee_number' => 'nullable|unique:users,employee_number,' . $id. ',user_id',
                'first_name' => 'nullable',
                'middle_name' => 'nullable',
                'last_name' => 'nullable',
                'suffix' => 'nullable',
                'email_address' => 'nullable|email|unique:users,email_address,' . $id. ',user_id',
                'department' => 'nullable',
                'phone_number' => 'nullable|regex:/^(\+?[0-9]{1,4})?\s?-?[0-9]{10}$/',
                'position' => 'nullable',
                'sys_role' => 'nullable|json',
                'display_picture' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 400);
            }

            $validatedData = $validator->validated();

            Log::info('Validated data: ' . json_encode($validatedData));

            // Handle sys_role
            if (isset($validatedData['sys_role'])) {
            $newRoles = json_decode($validatedData['sys_role'], true);
            $existingRoles = json_decode($user->sys_role, true) ?? [];

            $updatedRoles = array_unique(array_merge($existingRoles, $newRoles));
            sort($updatedRoles);
            $user->sys_role = json_encode(array_values($updatedRoles));

            Log::info('Updated sys_role: ' . $user->sys_role);
        }

            // Handle display_picture upload
            if ($request->hasFile('display_picture')) {
                $path = $request->file('display_picture')->store('profile_pictures', 'public');
                $user->display_picture = $path;
            }

            // Update user attributes
            foreach ($validatedData as $key => $value) {
                if ($key !== 'sys_role' && $key !== 'display_picture') {
                    $user->$key = $value;
                }
            }

            $user->save();

            Log::info('User updated successfully. Updated data: ' . json_encode($user));

            return response()->json(['message' => 'User updated successfully!', 'user' => $user], 200);
        } catch (\Exception $e) {
            Log::error('Error updating user: ' . $e->getMessage());
            return response()->json(['message' => 'Error updating user', 'error' => $e->getMessage()], 500);
        }
    }
}
