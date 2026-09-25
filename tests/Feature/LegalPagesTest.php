<?php

namespace Tests\Feature;

use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class LegalPagesTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
    }

    public function test_legal_notice_uses_configured_values(): void
    {
        config(['intellino.legal.company' => 'IntellIno SARL', 'intellino.legal.country' => 'Bénin']);

        $this->get('/mentions-legales')->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Legal/Notice')
                ->where('legal.company', 'IntellIno SARL')
                ->where('legal.country', 'Bénin')
                ->where('legal.director', null));
    }

    public function test_privacy_page_exposes_session_lifetime(): void
    {
        config(['session.lifetime' => 90]);

        $this->get('/confidentialite')->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('Legal/Privacy')->where('sessionMinutes', 90));
    }
}
