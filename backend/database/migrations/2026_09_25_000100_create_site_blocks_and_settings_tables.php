<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Listes de textes des pages (chiffres clés, FAQ, valeurs, étapes du Lab…), groupées par « collection ».
        Schema::create('site_blocks', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('collection', 40)->index();
            $table->string('icon', 16)->nullable();
            $table->string('title');
            $table->text('text')->nullable();
            $table->string('link')->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        // Paramètres modifiables dans l'admin ; ils remplacent les valeurs du fichier .env.
        Schema::create('settings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
        Schema::dropIfExists('site_blocks');
    }
};
