Nouveau message reçu depuis le site IntellIno.

Nom : {{ $contactMessage->nom }}
Organisation : {{ $contactMessage->organisation ?: '—' }}
E-mail : {{ $contactMessage->email }}
Téléphone : {{ $contactMessage->telephone ?: '—' }}
Sujet : {{ $contactMessage->sujet }}

Message :
{{ $contactMessage->message }}

---
Répondez directement à cet e-mail pour écrire à {{ $contactMessage->nom }}.
Voir dans l'administration : {{ $adminUrl }}
