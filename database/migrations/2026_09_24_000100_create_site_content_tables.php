<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('solutions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('slug')->unique();
            $table->string('icon', 16);
            $table->string('title');
            $table->string('color', 20)->default('blue'); // teinte du dégradé de la carte
            $table->json('items');
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('products', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('slug')->unique();
            $table->string('icon', 16);
            $table->string('category');
            $table->string('name');
            $table->text('description');
            $table->string('badge')->nullable();
            $table->string('badge_color', 20)->default('primary');
            $table->json('features');
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('softwares', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('slug')->unique();
            $table->string('icon', 16);
            $table->string('name');
            $table->string('description');
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('realisations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('icon', 16);
            $table->string('category');
            $table->string('title');
            $table->text('description');
            $table->string('color', 20)->default('blue');
            $table->json('tags');
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('posts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('slug')->unique();
            $table->string('category');
            $table->string('title');
            $table->text('excerpt');
            $table->longText('body')->nullable();
            $table->date('published_at');
            $table->timestamps();
        });

        Schema::create('contact_messages', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('nom');
            $table->string('organisation')->nullable();
            $table->string('telephone', 40)->nullable();
            $table->string('email');
            $table->string('sujet', 40);
            $table->text('message');
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contact_messages');
        Schema::dropIfExists('posts');
        Schema::dropIfExists('realisations');
        Schema::dropIfExists('softwares');
        Schema::dropIfExists('products');
        Schema::dropIfExists('solutions');
    }
};
