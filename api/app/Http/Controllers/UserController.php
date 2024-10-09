<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

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
        Log::info("DATA RECEIVED", $request->all());
        try {
            $user = User::findOrFail($id);

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

            // Handle sys_role
            if (isset($validatedData['sys_role'])) {
                $newRoles = is_array($validatedData['sys_role'])
                    ? $validatedData['sys_role']
                    : json_decode($validatedData['sys_role'], true);

                sort($newRoles);

                // Directly set the new roles instead of merging
                $user->sys_role = json_encode(array_values($newRoles));
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

            Log::info('User updated successfully!', ['user' => $user]);

            return response()->json(['message' => 'User updated successfully!', 'user' => $user], 200);
        } catch (\Exception $e) {
            Log::error('Error updating user: ' . $e->getMessage());
            return response()->json(['message' => 'Error updating user', 'error' => $e->getMessage()], 500);
        }
    }
    public function archiveUser($id)
    {
        try {
            $user = User::findOrFail($id);

            Log::info('User found: ' . json_encode($user));

            $userData = $user->toArray();
            if (is_array($userData['sys_role'])) {
                $userData['sys_role'] = json_encode($userData['sys_role']);

            }

            //Reset password to default
            $userData['password'] = Hash::make('archived_user_'. $user->id);

            // Format datetime values
            $userData['created_at'] = $user->created_at->format('Y-m-d H:i:s');
            $userData['updated_at'] = $user->updated_at->format('Y-m-d H:i:s');

            Log::info('User data: ' . json_encode($userData));

            //Connect to archive database
            DB::beginTransaction();
            DB::connection('archive_mysql')->table('users')->insert($userData);

            //Remove from current database
            $user->delete();

            DB::commit();

            return response()->json(['message' => 'User archived successfully!', 'user' => $user], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error archiving user: ' . $e->getMessage());
            return response()->json(['message' => 'Error archiving user', 'error' => $e->getMessage()], 500);
        }
    }
}
