<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends ApiController
{
    public function retrieveAll()
    {
        $events = Event::all();
        $this->status = 200;
        $this->response['data'] = $events;
        return $this->getResponse("Events retrieved successfully.");
    }

    public function create(Request $request)
    {
        $validatedData = $request->validate([
            'user_id' => 'required|exists:users,user_id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'event_date' => 'required|date',
            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i|after:start_time',
        ]);

        Event::create($validatedData);
        $this->status = 201;
        return $this->getResponse("Event created successfully.");
    }

    public function retrieve(Request $request)
    {
        $col = $request->query('col');
        $val = $request->query('val');

        $event = Event::where($col, $val)->first();

        if (!$event) {
            $this->status = 404;
            return $this->getResponse("Event not found.");
        }

        $this->status = 200;
        $this->response['data'] = $event;
        return $this->getResponse("Event retrieved successfully.");
    }

    public function update(Request $request, $event_id)
    {
        $event_id = $request->input('event_id');
        $event = Event::findOrFail($event_id);

        $validatedData = $request->validate([
            'user_id' => 'sometimes|required|exists:users,user_id',
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'event_date' => 'sometimes|required|date',
            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i|after:start_time',
        ]);

        $event->update($validatedData);

        $this->status = 200;
        return $this->getResponse("Event updated successfully.");
    }

    public function delete(Request $request)
    {
        $event_id = $request->query('event_id');
        $event = Event::findOrFail($event_id);
        $archivedEventData = $event->toArray();
        Event::on('archive_mysql')->create($archivedEventData);
        $event->delete();

        $this->status = 204;
        return $this->getResponse("Event deleted successfully.");
    }
}