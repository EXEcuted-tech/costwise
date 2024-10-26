<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class UserController extends ApiController
{
    public function getCurrentUser()
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }
        return response()->json($user->toArray());
    }

    public function retrieveUser(Request $request)
    {
        $user = User::findOrFail($request->user_id);
        return response()->json($user->toArray());
    }

    public function editUserInfo(Request $request)
    {
        $user = Auth::user();

        $validator = Validator::make($request->all(), [
            'fName' => 'string|max:255',
            'mName' => 'string|max:255|nullable',
            'lName' => 'string|max:255',
            'email' => 'email|max:255',
            'phoneNum' => 'string|max:255',
            'suffix' => 'string|max:5|nullable',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 400);
        }
        $user->first_name = $request->get('fName', $user->first_name);
        $user->middle_name = $request->get('mName', $user->middle_name);
        $user->last_name = $request->get('lName', $user->last_name);
        $user->email_address = $request->get('email', $user->email_address);
        $user->phone_number = $request->get('phoneNum', $user->phone_number);
        $user->display_picture = $request->get('displayPicture', $user->display_picture);
        $user->suffix = $request->get('suffix', $user->suffix);

        $user->save();

        return response()->json([
            'status' => 'success',
            'message' => 'User information updated successfully',
            'user' => $user
        ]);
    }

    public function updateProfilePicture(Request $request)
    {
        $user = Auth::user();

        $validator = Validator::make($request->all(), [
            'display_picture' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 400);
        }

        if ($request->hasFile('display_picture')) {
            if ($user->display_picture) {
                Storage::disk('public')->delete($user->display_picture);
            }

            $path = $request->file('display_picture')->store('profile_pictures', 'public');
            $user->display_picture = $path;
            $user->save();

            $fullUrl = asset('storage/' . $path);

            return response()->json([
                'status' => 'success',
                'message' => 'Profile picture updated successfully',
                'display_picture' => $fullUrl
            ]);
        }

        return response()->json([
            'status' => 'error',
            'message' => 'No file was uploaded'
        ], 400);
    }

    public function getAllUsers()
    {
        $users = User::all();
        return response()->json($users);
    }

    public function getUserRoles(Request $request)
    {
        $user = User::findOrFail($request->user_id);
        return response()->json($user->sys_role);
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

            if (isset($validatedData['sys_role'])) {
                $newRoles = is_array($validatedData['sys_role'])
                    ? $validatedData['sys_role']
                    : json_decode($validatedData['sys_role'], true);

                sort($newRoles);

                $user->sys_role = json_encode(array_values($newRoles));
            }

            if ($request->hasFile('display_picture')) {
                $path = $request->file('display_picture')->store('profile_pictures', 'public');
                $user->display_picture = $path;
            }

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

            $userData['password'] = Hash::make('archived_user_'. $user->id);

            $userData['created_at'] = $user->created_at->format('Y-m-d H:i:s');
            $userData['updated_at'] = $user->updated_at->format('Y-m-d H:i:s');

            DB::beginTransaction();
            DB::connection('archive_mysql')->table('users')->insert($userData);

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
