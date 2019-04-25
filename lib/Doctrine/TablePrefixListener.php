<?php

namespace MailPoet\Doctrine;

use MailPoetVendor\Doctrine\ORM\Event\LoadClassMetadataEventArgs;
use MailPoetVendor\Doctrine\ORM\Mapping\ClassMetadataInfo;

// Taken from Doctrine docs:
// https://www.doctrine-project.org/projects/doctrine-orm/en/2.5/cookbook/sql-table-prefixes.html
class TablePrefixListener {
  /** @var string */
  private $prefix;

  function __construct($prefix) {
    $this->prefix = $prefix;
  }

  function loadClassMetadata(LoadClassMetadataEventArgs $eventArgs) {
    $classMetadata = $eventArgs->getClassMetadata();

    if (!$classMetadata->isInheritanceTypeSingleTable() || $classMetadata->getName() === $classMetadata->rootEntityName) {
      $classMetadata->setPrimaryTable([
        'name' => $this->prefix . $classMetadata->getTableName()
      ]);
    }

    foreach ($classMetadata->getAssociationMappings() as $fieldName => $mapping) {
      if ($mapping['type'] == ClassMetadataInfo::MANY_TO_MANY && $mapping['isOwningSide']) {
        $mappedTableName = $mapping['joinTable']['name'];
        $classMetadata->associationMappings[$fieldName]['joinTable']['name'] = $this->prefix . $mappedTableName;
      }
    }
  }
}
