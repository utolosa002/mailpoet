<?php

// Doctrine namespaces in string literals are not always correctly prefixed
$iterator = new RecursiveDirectoryIterator("../vendor-prefixed/doctrine", RecursiveDirectoryIterator::SKIP_DOTS);
$files = new RecursiveIteratorIterator($iterator, RecursiveIteratorIterator::SELF_FIRST);
foreach ($files as $file) {
  if (substr($file, -3) === 'php') {
    $data = file_get_contents($file);
    $data = str_replace('\'Doctrine\\\\', '\'MailPoetVendor\\\\Doctrine\\\\', $data);
    $data = str_replace('"Doctrine\\\\', '"MailPoetVendor\\\\Doctrine\\\\', $data);
    $data = str_replace(' \\Doctrine\\', ' \\MailPoetVendor\\Doctrine\\', $data);
    file_put_contents($file, $data);
  }
}
