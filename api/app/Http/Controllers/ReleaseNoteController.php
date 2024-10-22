<?php

namespace App\Http\Controllers;

use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\ReleaseNote;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;


class ReleaseNoteController extends ApiController
{
    public function retrieve(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'note_id' => 'required|integer',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors(),
                    'message' => 'Incorrect input details.'
                ], 400);
            }

            $note = ReleaseNote::with('user:user_id,first_name,middle_name,last_name,suffix')->find($request->note_id);

            if (!$note) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Release Note not found.'
                ], 404);
            }

            $formattedNote = [
                'note_id' => $note->note_id,
                'title' => $note->title,
                'version' => $note->version,
                'content' => $note->content,
                'created_at' => $note->created_at,
                'user' => [
                    'user_id' => $note->user->user_id,
                    'name' => $note->user->first_name . ' ' . $note->user->middle_name . ' ' . $note->user->last_name . ' ' . $note->user->suffix
                    ]
            ];

            return response()->json([
                'status' => 'success',
                'data' => $formattedNote,
                'message' => 'Release Note retrieved successfully.'
            ], 200);
        } catch (\Throwable $th) {
           return response()->json([
                'status' => 'error',
                'message' => $th->getMessage()
            ], 500);
        }
    }


    public function retrieveAll()
    {
        try {
            $notes = ReleaseNote::with('user:user_id,first_name,middle_name,last_name,suffix')->orderBy('created_at', 'desc')->get();

            if ($notes->isEmpty()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'No release notes found.'
                ], 404);
            }

            $formattedNotes = $notes->map(function ($note) {
                return [
                    'note_id' => $note->note_id,
                    'title' => $note->title,
                    'version' => $note->version,
                    'content' => $note->content,
                    'created_at' => $note->created_at,
                    'user' => [
                        'user_id' => $note->user->user_id,
                        'name' => $note->user->first_name . ' ' . $note->user->middle_name . ' ' . $note->user->last_name . ' ' . $note->user->suffix
                    ]
                ];
            });

            return response()->json([
                'status' => 'success',
                'data' => $formattedNotes,
                'message' => 'Release Notes retrieved successfully.'
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred: ' . $th->getMessage(),
            ], 500);
        }
    }

    public function createNote(Request $request)
    {
        try {
            $validator = Validator::make(
                $request->all(),
                [
                    'title' => 'required',
                    'version' => 'required',
                    'content' => 'required',
                    'user_id' => 'required|exists:users,user_id'
                ]
            );

            if ($validator->fails()) {
                $this->status = 401;
                $this->response['error'] = $validator->errors();
                return $this->getResponse("Incorrect input details.");
            }

            $validatedData = $validator->validated();
            $validatedData['content'] = json_decode($validatedData['content'], true);

            $note = ReleaseNote::create($validatedData);

            $this->status = 200;
            $this->response['data'] = $note;
            return $this->getResponse("Release Note Successfully Created");
        } catch (\Throwable $th) {
            $this->status = $th->getCode();
            $this->response['message'] = $th->getMessage();
            return $this->getResponse();
        }
    }

    public function updateNote(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'note_id' => 'sometimes|required',
                'title' => 'sometimes|required',
                'version' => 'sometimes|required',
                'content' => 'sometimes|required',
                'updated_at' => now()
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors(),
                    'message' => 'Incorrect input details.'
                ], 400);
            }

            $note = ReleaseNote::findOrFail($request->note_id);

            $validatedData = $validator->validated();
            if (isset($validatedData['content'])) {
                $validatedData['content'] = json_decode($validatedData['content'], true);
            }

            $note->update($validator->validated());

            return response()->json([
                'status' => 'success',
                'data' => $note,
                'message' => 'Release Note successfully updated.'
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 'error',
                'message' => $th->getMessage()
            ], 500);
        }
    }

    public function deleteNote(Request $request)
    {
        try {

            $note = ReleaseNote::where('note_id', $request->note_id)->first();

            if (!$note) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Release Note not found.'
                ], 404);
            }

            // Format datetime values
            $noteData = $note->toArray();
            $noteData['created_at'] = $note->created_at->format('Y-m-d H:i:s');
            $noteData['updated_at'] = $note->updated_at->format('Y-m-d H:i:s');
            $noteData['content'] = json_encode($noteData['content']);
            $noteData['user_id'] = NULL;

            //Archive release note
            DB::beginTransaction();
            DB::connection('archive_mysql')->table('release_notes')->insert($noteData);
            $note->delete();

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Release Note successfully deleted.'
            ], 200);
        } catch (\Throwable $th) {
            Log::error($th->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => $th->getMessage()
            ], 500);
        }
    }

}
