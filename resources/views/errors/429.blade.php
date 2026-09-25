@extends('errors.layout')

@section('code', '429')
@section('title', 'Trop de requêtes')
@section('heading')
    Un peu de <span>patience</span>
@endsection
@section('message')
    Vous avez effectué trop de demandes en peu de temps. Merci de réessayer dans une minute.
@endsection
