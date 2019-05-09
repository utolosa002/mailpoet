<?php

namespace MailPoet\Doctrine;

use MailPoetVendor\Doctrine\Common\Annotations\SimpleAnnotationReader;
use MailPoetVendor\Doctrine\Common\Cache\FilesystemCache;
use MailPoetVendor\Doctrine\ORM\Configuration;
use MailPoetVendor\Doctrine\ORM\Mapping\UnderscoreNamingStrategy;

class ConfigurationFactory {
  const ENTITY_DIR = __DIR__ . '/../Doctrine/Entities';
  const METADATA_DIR = __DIR__ . '/../../generated/doctrine-metadata';

  /** @var bool */
  private $is_dev_mode;

  function __construct() {
    $this->is_dev_mode = WP_DEBUG;
  }

  function createConfiguration() {
    $configuration = new Configuration();
    $configuration->setNamingStrategy(new UnderscoreNamingStrategy());

    $this->configureMetadata($configuration);

    if (!$this->is_dev_mode) {
      $configuration->ensureProductionSettings();
    }
    return $configuration;
  }

  private function configureMetadata(Configuration $configuration) {
    // on production load metadata only from pre-generated cache
    $metadata_storage = new FilesystemCache(self::METADATA_DIR);
    $metadata_storage->setNamespace('mp3-' . md5(self::METADATA_DIR) . '-');
    $configuration->setMetadataCacheImpl($metadata_storage);

    // in dev mode register annotation reader if doctrine/annotations package is installed
    if ($this->is_dev_mode && class_exists(SimpleAnnotationReader::class)) {
      $configuration->setMetadataDriverImpl($configuration->newDefaultAnnotationDriver([self::ENTITY_DIR]));
    }
  }
}
