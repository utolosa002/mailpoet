<?php

namespace MailPoet\Test\Config;

use Codeception\Stub;
use Codeception\Stub\Expected;
use MailPoet\Config\AccessControl;
use MailPoet\WP\Functions as WPFunctions;

class AccessControlTest extends \MailPoetTest {

  /** @var AccessControl */
  private $access_control;

  function _before() {
    parent::_before();
    $this->access_control = new AccessControl;
  }

  function testItAllowsSettingCustomPermissions() {
    $wp = new WPFunctions;
    $wp->addFilter(
      'mailpoet_permission_access_plugin_admin',
      function() {
        return ['custom_access_plugin_admin_role'];
      }
    );
    $wp->addFilter(
      'mailpoet_permission_manage_settings',
      function() {
        return ['custom_manage_settings_role'];
      }
    );
    $wp->addFilter(
      'mailpoet_permission_manage_features',
      function() {
        return ['custom_manage_features_role'];
      }
    );
    $wp->addFilter(
      'mailpoet_permission_manage_emails',
      function() {
        return ['custom_manage_emails_role'];
      }
    );
    $wp->addFilter(
      'mailpoet_permission_manage_subscribers',
      function() {
        return ['custom_manage_subscribers_role'];
      }
    );
    $wp->addFilter(
      'mailpoet_permission_manage_forms',
      function() {
        return ['custom_manage_forms_role'];
      }
    );
    $wp->addFilter(
      'mailpoet_permission_manage_segments',
      function() {
        return ['custom_manage_segments_role'];
      }
    );

    expect($this->access_control->getDefaultPermissions())->equals(
      [
        AccessControl::PERMISSION_ACCESS_PLUGIN_ADMIN => [
          'custom_access_plugin_admin_role',
        ],
        AccessControl::PERMISSION_MANAGE_SETTINGS => [
          'custom_manage_settings_role',
        ],
        AccessControl::PERMISSION_MANAGE_FEATURES => [
          'custom_manage_features_role',
        ],
        AccessControl::PERMISSION_MANAGE_EMAILS => [
          'custom_manage_emails_role',
        ],
        AccessControl::PERMISSION_MANAGE_SUBSCRIBERS => [
          'custom_manage_subscribers_role',
        ],
        AccessControl::PERMISSION_MANAGE_FORMS => [
          'custom_manage_forms_role',
        ],
        AccessControl::PERMISSION_MANAGE_SEGMENTS => [
          'custom_manage_segments_role',
        ],
      ]
    );
  }

  function testItGetsPermissionLabels() {
    $permissions = $this->access_control->getDefaultPermissions();
    $labels = $this->access_control->getPermissionLabels();
    expect(count($permissions))->equals(count($labels));
  }

  function testItValidatesIfUserHasCapability() {
    $capability = 'some_capability';
    $access_control = new AccessControl();
    WPFunctions::set(Stub::make(new WPFunctions, [
      'currentUserCan' => true,
    ]));

    expect($access_control->validatePermission($capability))->true();
  }

  function _after() {
    WPFunctions::set(new WPFunctions);
  }
}
