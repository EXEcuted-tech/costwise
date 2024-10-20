<?php

namespace App\Http\Controllers;

use App\Http\Controllers\ApiController;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ArticleController extends ApiController
{
    public function uploadArticle(Request $request)
    {
        try {
            $validator = Validator::make(
                $request->all(),
                [
                    'category' => 'required',
                    'content' => 'required'
                ]
            );

            if ($validator->fails()) {
                $this->status = 401;
                $this->response['error'] = $validator->errors();
                return $this->getResponse("Incorrect input details.");
            }

            $validatedData = $validator->validated();

            $article = Article::create($validatedData);
            $this->status = 200;
            $this->response['data'] = $article;
            return $this->getResponse("Article Successfully Uploaded");
        } catch (\Throwable $th) {
            $this->status = $th->getCode();
            $this->response['message'] = $th->getMessage();
            return $this->getResponse();
        }
    }

    public function getArticle(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'category' => 'required',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors(),
                    'message' => 'Incorrect input details.'
                ], 400);
            }

            $article = Article::where('category', $request->category)->get();

            if (!$article) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Model not found.'
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'data' => $article,
                'message' => 'Model retrieved successfully.'
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 'error',
                'message' => $th->getMessage()
            ], 500);
        }
    }

    public function updateArticle(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'category' => 'sometimes|required',
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

            $article = Article::where('category', $request->category)->first();

            if (!$article) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Article not found.'
                ], 404);
            }

            $article->update($validator->validated());

            return response()->json([
                'status' => 'success',
                'data' => $article,
                'message' => 'Article successfully updated.'
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 'error',
                'message' => $th->getMessage()
            ], 500);
        }
    }

    public function getAll(Request $request)
    {
        try {
            $articles = Article::all();


            if ($articles->isEmpty()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'No articles found.'
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'data' => $articles,
                'message' => 'Articles retrieved successfully.'
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred: ' . $th->getMessage(),
            ], 500);
        }
    }
}
