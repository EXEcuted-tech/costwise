<?php

namespace App\Http\Controllers;

use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\ReleaseNote;
use Illuminate\Support\Facades\DB;
class ReleaseNoteController extends ApiController
{
    public function retrieve(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'note_id' => 'required',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors(),
                    'message' => 'Incorrect input details.'
                ], 400);
            }

            $note = ReleaseNote::where('note_id', $request->note_id)->get();

            if (!$note) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Release Note not found.'
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'data' => $note,
                'message' => 'Release Note retrieved successfully.'
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 'error',
                'message' => $th->getMessage()
            ], 500);
        }
    }


    public function retrieveAll(Request $request)
    {
        try {
            $notes = ReleaseNote::all();


            if ($notes->isEmpty()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'No release notes found.'
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'data' => $notes,
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
                    'user_id' => 'required'
                ]
            );

            if ($validator->fails()) {
                $this->status = 401;
                $this->response['error'] = $validator->errors();
                return $this->getResponse("Incorrect input details.");
            }

            $validatedData = $validator->validated();

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

            $note = ReleaseNote::where('note_id', $request->note_id)->first();

            if (!$note) {
                return response()->json([
                    'status' => 'error',
                        'message' => 'Release Note not found.'
                ], 404);
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
            //Connect to archive database
            DB::beginTransaction();

            $note = ReleaseNote::where('note_id', $request->note_id)->first();

            if (!$note) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Release Note not found.'
                ], 404);
            }

            //Archive release note
            DB::connection('archive_mysql')->table('release_notes')->insert($note->toArray());
            $note->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Release Note successfully deleted.'
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 'error',
                'message' => $th->getMessage()
            ], 500);
        }
    }

}
