<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('realisations', function (Blueprint $table) {
            $table->string('slug')->nullable()->after('id');
            $table->string('client')->nullable()->after('title');
            $table->unsignedSmallInteger('year')->nullable()->after('client');
            $table->text('details')->nullable()->after('description');
        });

        // Slugs des réalisations existantes, générés depuis le titre.
        foreach (DB::table('realisations')->get(['id', 'title']) as $row) {
            DB::table('realisations')->where('id', $row->id)->update(['slug' => Str::slug($row->title)]);
        }

        Schema::table('realisations', function (Blueprint $table) {
            $table->string('slug')->nullable(false)->unique()->change();
        });
    }

    public function down(): void
    {
        Schema::table('realisations', function (Blueprint $table) {
            $table->dropUnique(['slug']);
            $table->dropColumn(['slug', 'client', 'year', 'details']);
        });
    }
};
