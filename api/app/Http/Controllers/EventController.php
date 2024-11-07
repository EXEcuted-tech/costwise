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

    public function update(Request $request)
    {
        $event = Event::findOrFail($request->input('id'));

        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date' => 'required|date',
            'startTime' => 'required|date_format:H:i',
            'endTime' => 'required|date_format:H:i|after:startTime',
        ]);

        $event->update([
            'title' => $validatedData['title'],
            'description' => $validatedData['description'],
            'event_date' => $validatedData['date'],
            'start_time' => $validatedData['startTime'],
            'end_time' => $validatedData['endTime'],
        ]);

        $this->status = 200;
        return $this->getResponse("Event updated successfully.");
    }

    public function delete(Request $request)
    {
        $event_id = $request->input('event_id');
        $event = Event::findOrFail($event_id);
        $archivedEventData = $event->toArray();
        $archivedEventData['user_id'] = null;
        Event::on('archive_mysql')->create($archivedEventData);
        $event->delete();

        $this->status = 200;
        return $this->getResponse("Event archived successfully.");
    }
}
