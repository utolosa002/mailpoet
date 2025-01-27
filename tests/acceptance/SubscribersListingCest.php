<?php

namespace MailPoet\Test\Acceptance;

use MailPoet\Test\DataFactories\Subscriber;

require_once __DIR__ . '/../DataFactories/Subscriber.php';

class SubscribersListingCest {

  function subscribersListing(\AcceptanceTester $I) {
    $I->wantTo('Open subscribers listings page');

    $subscriber = (new Subscriber())
      ->withEmail('wp@example.com')
      ->create();

    $I->login();
    $I->amOnMailpoetPage('Subscribers');
    $I->searchFor('wp@example.com', 2);
    $I->waitForText('wp@example.com');

    $subscriber->delete();
  }

}
