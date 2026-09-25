@extends('errors.layout')

@section('code', '500')
@section('title', 'Erreur serveur')
@section('heading')
    Une erreur est <span>survenue</span>
@endsection
@section('message')
    Un problème technique empêche l'affichage de cette page. Notre équipe a été informée ; merci de réessayer dans quelques instants.
@endsection
