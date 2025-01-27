<?php

namespace MailPoet\Test\API\JSON;

use Codeception\Stub;
use MailPoet\API\JSON\ErrorResponse;
use MailPoet\WP\Functions as WPFunctions;

class ErrorResponseTest extends \MailPoetUnitTest {
  function testItSanitizesSqlErrorsWhenReturningResponse() {
    WPFunctions::set(Stub::make(new WPFunctions, [
      '__' => function ($value) {
        return $value;
      },
    ]));
    $errors = [
      'valid error',
      'SQLSTATE[22001]: Some SQL error',
      'another valid error',
    ];
    $error_response = new ErrorResponse($errors);
    expect($error_response->getData())->equals(
      [
        'errors' => [
          [
            'error' => 0,
            'message' => 'valid error',
          ],
          [
            'error' => 1,
            'message' => 'An unknown error occurred.',
          ],
          [
            'error' => 2,
            'message' => 'another valid error',
          ],
        ],
      ]
    );
  }

  function _after() {
    WPFunctions::set(new WPFunctions);
  }
}