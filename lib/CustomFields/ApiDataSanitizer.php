<?php

namespace MailPoet\CustomFields;

use InvalidArgumentException;
use MailPoet\Models\CustomField;

class ApiDataSanitizer {

  function sanitize(array $data = []) {
    $this->checkMandatoryStringParameter($data, 'name');
    $this->checkMandatoryStringParameter($data, 'type');
    $this->checkParamsType($data);
    return [
      'name' => $data['name'],
      'type' => strtolower($data['type']),
      'params' => $this->sanitizeParams($data),
    ];
  }

  private function checkMandatoryStringParameter(array $data, $parameter_name) {
    if (empty($data[$parameter_name])) {
      throw new InvalidArgumentException(sprintf(__('Mandatory argument "%s" is missing', 'mailpoet'), $parameter_name));
    }
    if (!is_string($data[$parameter_name])) {
      throw new InvalidArgumentException(sprintf(__('Mandatory argument "%s" has to be string', 'mailpoet'), $parameter_name));
    }
  }

  private function checkParamsType($data) {
    if (isset($data['params']) && !is_array($data['params'])) {
      throw new InvalidArgumentException(sprintf(__('Params has to be array', 'mailpoet')));
    }
  }

  private function sanitizeParams($data) {
    $data['params'] = isset($data['params']) ? $data['params'] : [];
    $result = [];
    $result['required'] = $this->getRequired($data['params']);
    $result['label'] = $this->getLabel($data);
    return $result + $this->getExtraParams($data);
  }

  private function getLabel($data) {
    if (empty($data['params']['label'])) {
      return $data['name'];
    } else {
      return $data['params']['label'];
    }
  }

  private function getRequired($params) {
    if (isset($params['required']) && $params['required']) {
      return '1';
    }
    return '';
  }

  private function getExtraParams($data) {
    $type = strtolower($data['type']);
    if (in_array($type, [CustomField::TYPE_TEXT, CustomField::TYPE_TEXTAREA], true)) {
      return $this->getExtraParamsForText($data['params']);
    }

    if (in_array($type, [CustomField::TYPE_RADIO, CustomField::TYPE_SELECT], true)) {
      return $this->getExtraParamsForSelect($data['params']);
    }

    if ($type === CustomField::TYPE_CHECKBOX) {
      return $this->getExtraParamsForCheckbox($data['params']);
    }

    if ($type === CustomField::TYPE_DATE) {
      return $this->getExtraParamsForDate($data['params']);
    }

    throw new InvalidArgumentException(sprintf(__('Invalid type "%s"', 'mailpoet'), $type));
  }

  private function getExtraParamsForText($params) {
    if (isset($params['validate'])) {
      $validate = trim(strtolower($params['validate']));
      if (in_array($validate, ['number', 'alphanum', 'phone'], true)) {
        return ['validate' => $validate];
      }
      throw new InvalidArgumentException(__('Validate parameter is not valid', 'mailpoet'));
    }
    return [];
  }

  private function getExtraParamsForCheckbox($params) {
    if (empty($params['values']) || count($params['values']) > 1) {
      throw new InvalidArgumentException(__('You need to pass exactly one value for checkbox', 'mailpoet'));
    }
    $value = reset($params['values']);
    return ['values' => [$this->sanitizeValue($value)]];
  }

  private function getExtraParamsForDate($params) {
    $date_type = (isset($params['date_type'])
      ? $params['date_type']
      : 'year_month_day'
    );
    $input_date_format = (isset($params['date_format'])
      ? $params['date_format']
      : ''
    );

    switch ($date_type) {
      case 'year_month_day':
        if (!in_array($input_date_format, ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY/MM/DD'], true)) {
          throw new InvalidArgumentException(__('Invalid date_format for year_month_day', 'mailpoet'));
        }
        $date_format = $input_date_format;
        break;
      case 'year_month':
        if (!in_array($input_date_format, ['YYYY/MM', 'MM/YY'], true)) {
          throw new InvalidArgumentException(__('Invalid date_format for year_month', 'mailpoet'));
        }
        $date_format = $input_date_format;
        break;
      case 'month':
        $date_format = 'MM';
        break;
      case 'year':
        $date_format = 'YYYY';
        break;
      case 'day':
        $date_format = 'DD';
        break;
      default:
        throw new InvalidArgumentException(__('Invalid value for date_type', 'mailpoet'));
    }
    return [
      'date_type' => $date_type,
      'date_format' => $date_format,
    ];
  }

  private function getExtraParamsForSelect($params) {
    if (empty($params['values'])) {
      throw new InvalidArgumentException(__('You need to pass some values for this type', 'mailpoet'));
    }
    $values = [];
    foreach ($params['values'] as $value) {
      $values[] = $this->sanitizeValue($value);
    }
    return ['values' => $values];
  }

  private function sanitizeValue($value) {
    if (empty($value['value'])) {
      throw new InvalidArgumentException(__('Value cannot be empty', 'mailpoet'));
    }
    $result = ['value' => $value['value']];
    if (isset($value['is_checked']) && $value['is_checked']) {
      $result['is_checked'] = '1';
    } else {
      $result['is_checked'] = '';
    }
    return $result;
  }

}
