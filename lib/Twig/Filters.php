<?php

namespace MailPoet\Twig;
use MailPoetVendor\Twig_SimpleFilter;
use MailPoetVendor\Twig_Extension;

if (!defined('ABSPATH')) exit;

class Filters extends Twig_Extension {

  function getName() {
    return 'filters';
  }

  function getFilters() {
    return array(
      new Twig_SimpleFilter(
        'intval',
        'intval'
      ),
      new Twig_SimpleFilter(
        'replaceLinkTags',
        'MailPoet\Util\Helpers::replaceLinkTags'
      )
    );
  }
}
