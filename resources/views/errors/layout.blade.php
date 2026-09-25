<!DOCTYPE html>
<html lang="fr">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="robots" content="noindex">
        <title>@yield('title') — IntellIno</title>
        {{-- Page autonome (sans Vite ni base de données) pour s'afficher même quand l'application est en panne. --}}
        <style>
            *{box-sizing:border-box}
            body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;
                 background:#080808;color:#f5f5f5;font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;text-align:center}
            .glow{position:fixed;top:30%;left:50%;width:600px;height:400px;max-width:100vw;transform:translate(-50%,-50%);
                  background:rgba(249,115,22,.12);border-radius:50%;filter:blur(120px);pointer-events:none}
            main{position:relative;max-width:480px}
            .code{font-size:14px;font-weight:600;letter-spacing:.2em;color:#f97316;border:1px solid rgba(249,115,22,.3);
                  background:rgba(249,115,22,.1);display:inline-block;padding:4px 12px;border-radius:999px;margin-bottom:24px}
            h1{font-size:34px;font-weight:900;margin:0 0 16px;line-height:1.2}
            h1 span{color:#f97316}
            p{color:#999;line-height:1.6;margin:0 0 32px}
            a{display:inline-block;background:#f97316;color:#000;font-weight:700;font-size:14px;text-decoration:none;padding:12px 22px;border-radius:8px}
            a:hover{background:#fb8a3c}
        </style>
    </head>
    <body>
        <div class="glow"></div>
        <main>
            <div class="code">ERREUR @yield('code')</div>
            <h1>@yield('heading')</h1>
            <p>@yield('message')</p>
            <a href="/">Retour à l'accueil</a>
        </main>
    </body>
</html>
