import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';

import Listing from 'listing/listing.jsx';
import ListingTabs from 'newsletters/listings/tabs.jsx';
import ListingHeading from 'newsletters/listings/heading.jsx';
import FeatureAnnouncement from 'announcements/feature_announcement.jsx';

import {
  StatisticsMixin,
  MailerMixin,
  CronMixin,
} from 'newsletters/listings/mixins.jsx';

import classNames from 'classnames';
import MailPoet from 'mailpoet';
import _ from 'underscore';
import Hooks from 'wp-js-hooks';

const mailpoetRoles = window.mailpoet_roles || {};
const mailpoetSegments = window.mailpoet_segments || {};
const mailpoetTrackingEnabled = (!!(window.mailpoet_tracking_enabled));

const messages = {
  onTrash: (response) => {
    const count = Number(response.meta.count);
    let message = null;

    if (count === 1) {
      message = (
        MailPoet.I18n.t('oneNewsletterTrashed')
      );
    } else {
      message = (
        MailPoet.I18n.t('multipleNewslettersTrashed')
      ).replace('%$1d', count.toLocaleString());
    }
    MailPoet.Notice.success(message);
  },
  onDelete: (response) => {
    const count = Number(response.meta.count);
    let message = null;

    if (count === 1) {
      message = (
        MailPoet.I18n.t('oneNewsletterDeleted')
      );
    } else {
      message = (
        MailPoet.I18n.t('multipleNewslettersDeleted')
      ).replace('%$1d', count.toLocaleString());
    }
    MailPoet.Notice.success(message);
  },
  onRestore: (response) => {
    const count = Number(response.meta.count);
    let message = null;

    if (count === 1) {
      message = (
        MailPoet.I18n.t('oneNewsletterRestored')
      );
    } else {
      message = (
        MailPoet.I18n.t('multipleNewslettersRestored')
      ).replace('%$1d', count.toLocaleString());
    }
    MailPoet.Notice.success(message);
  },
};

const columns = [
  {
    name: 'subject',
    label: MailPoet.I18n.t('subject'),
    sortable: true,
  },
  {
    name: 'status',
    label: MailPoet.I18n.t('status'),
    width: 145,
  },
  {
    name: 'settings',
    label: MailPoet.I18n.t('settings'),
  },
  {
    name: 'statistics',
    label: MailPoet.I18n.t('statistics'),
    display: mailpoetTrackingEnabled,
  },
  {
    name: 'updated_at',
    label: MailPoet.I18n.t('lastModifiedOn'),
    sortable: true,
  },
];

const bulkActions = [
  {
    name: 'trash',
    label: MailPoet.I18n.t('moveToTrash'),
    onSuccess: messages.onTrash,
  },
];

let newsletterActions = [
  {
    name: 'view',
    link: function link(newsletter) {
      return (
        <a href={newsletter.preview_url} target="_blank" rel="noopener noreferrer">
          {MailPoet.I18n.t('preview')}
        </a>
      );
    },
  },
  {
    name: 'duplicate',
    label: MailPoet.I18n.t('duplicate'),
    onClick: (newsletter, refresh) => MailPoet.Ajax.post({
      api_version: window.mailpoet_api_version,
      endpoint: 'newsletters',
      action: 'duplicate',
      data: {
        id: newsletter.id,
      },
    }).done((response) => {
      MailPoet.Notice.success((MailPoet.I18n.t('newsletterDuplicated')).replace('%$1s', response.data.subject));
      refresh();
    }).fail((response) => {
      if (response.errors.length > 0) {
        MailPoet.Notice.error(
          response.errors.map(error => error.message),
          { scroll: true }
        );
      }
    }),
  },
  {
    name: 'edit',
    link: function link(newsletter) {
      return (
        <a href={`?page=mailpoet-newsletter-editor&id=${newsletter.id}`}>
          {MailPoet.I18n.t('edit')}
        </a>
      );
    },
  },
  {
    name: 'trash',
  },
];

Hooks.addFilter('mailpoet_newsletters_listings_welcome_notification_actions', 'mailpoet', StatisticsMixin.addStatsCTAAction);
newsletterActions = Hooks.applyFilters('mailpoet_newsletters_listings_welcome_notification_actions', newsletterActions);

const NewsletterListWelcome = createReactClass({ // eslint-disable-line react/prefer-es6-class
  displayName: 'NewsletterListWelcome',

  propTypes: {
    location: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    match: PropTypes.shape({
      params: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    }).isRequired,
  },

  mixins: [StatisticsMixin, MailerMixin, CronMixin],

  updateStatus: function updateStatus(e) {
    // make the event persist so that we can still override the selected value
    // in the ajax callback
    e.persist();

    MailPoet.Ajax.post({
      api_version: window.mailpoet_api_version,
      endpoint: 'newsletters',
      action: 'setStatus',
      data: {
        id: Number(e.target.getAttribute('data-id')),
        status: e.target.value,
      },
    }).done((response) => {
      if (response.data.status === 'active') {
        MailPoet.Notice.success(MailPoet.I18n.t('welcomeEmailActivated'));
      }
      // force refresh of listing so that groups are updated
      this.forceUpdate();
    }).fail((response) => {
      MailPoet.Notice.error(MailPoet.I18n.t('welcomeEmailActivationFailed'));

      // reset value to actual newsletter's status
      e.target.value = response.status;
    });
  },

  renderStatus: function renderStatus(newsletter) {
    const totalSentMessage = MailPoet.I18n.t('sentToXSubscribers')
      .replace('%$1d', newsletter.total_sent.toLocaleString());
    const totalScheduledMessage = MailPoet.I18n.t('scheduledToXSubscribers')
      .replace('%$1d', newsletter.total_scheduled.toLocaleString());

    return (
      <div>
        <p>
          <select
            data-id={newsletter.id}
            defaultValue={newsletter.status}
            onChange={this.updateStatus}
          >
            <option value="active">{ MailPoet.I18n.t('active') }</option>
            <option value="draft">{ MailPoet.I18n.t('inactive') }</option>
          </select>
        </p>
        <p>
          { totalSentMessage }
          {' '}
          <br />
          { totalScheduledMessage }
        </p>
      </div>
    );
  },

  renderSettings: function renderSettings(newsletter) {
    let sendingEvent;
    let sendingDelay;
    let segment;

    // set sending event
    switch (newsletter.options.event) {
      case 'user':
        // WP User
        if (newsletter.options.role === 'mailpoet_all') {
          sendingEvent = MailPoet.I18n.t('welcomeEventWPUserAnyRole');
        } else {
          sendingEvent = MailPoet.I18n.t('welcomeEventWPUserWithRole').replace(
            '%$1s', mailpoetRoles[newsletter.options.role]
          );
        }
        break;

      default:
        // get segment
        segment = _.find(
          mailpoetSegments,
          seg => (Number(seg.id) === Number(newsletter.options.segment))
        );

        if (segment === undefined) {
          return (
            <span className="mailpoet_error">
              { MailPoet.I18n.t('sendingToSegmentsNotSpecified') }
            </span>
          );
        }
        sendingEvent = MailPoet.I18n.t('welcomeEventSegment').replace(
          '%$1s', segment.name
        );

        break;
    }

    // set sending delay
    if (sendingEvent) {
      if (newsletter.options.afterTimeType !== 'immediate') {
        switch (newsletter.options.afterTimeType) {
          case 'hours':
            sendingDelay = MailPoet.I18n.t('sendingDelayHours').replace(
              '%$1d', newsletter.options.afterTimeNumber
            );
            break;

          case 'days':
            sendingDelay = MailPoet.I18n.t('sendingDelayDays').replace(
              '%$1d', newsletter.options.afterTimeNumber
            );
            break;

          case 'weeks':
            sendingDelay = MailPoet.I18n.t('sendingDelayWeeks').replace(
              '%$1d', newsletter.options.afterTimeNumber
            );
            break;

          default:
            sendingDelay = MailPoet.I18n.t('sendingDelayInvalid');
            break;
        }
        sendingEvent += ` [${sendingDelay}].`;
      }
    }

    return (
      <span>
        { sendingEvent }
      </span>
    );
  },

  renderItem: function renderItem(newsletter, actions) {
    const rowClasses = classNames(
      'manage-column',
      'column-primary',
      'has-row-actions'
    );

    return (
      <div>
        <td className={rowClasses}>
          <strong>
            <a
              className="row-title"
              href={`?page=mailpoet-newsletter-editor&id=${newsletter.id}`}
            >
              { newsletter.subject }
            </a>
          </strong>
          { actions }
        </td>
        <td className="column" data-colname={MailPoet.I18n.t('status')}>
          { this.renderStatus(newsletter) }
        </td>
        <td className="column" data-colname={MailPoet.I18n.t('settings')}>
          { this.renderSettings(newsletter) }
        </td>
        { (mailpoetTrackingEnabled === true) ? (
          <td className="column" data-colname={MailPoet.I18n.t('statistics')}>
            { this.renderStatistics(
              newsletter,
              newsletter.total_sent > 0 && newsletter.statistics
            ) }
          </td>
        ) : null }
        <td className="column-date" data-colname={MailPoet.I18n.t('lastModifiedOn')}>
          <abbr>{ MailPoet.Date.format(newsletter.updated_at) }</abbr>
        </td>
      </div>
    );
  },

  render: function render() {
    return (
      <div>
        <ListingHeading />

        <FeatureAnnouncement hasNews={window.mailpoet_feature_announcement_has_news} />

        <ListingTabs tab="welcome" />

        <Listing
          limit={window.mailpoet_listing_per_page}
          location={this.props.location}
          params={this.props.match.params}
          endpoint="newsletters"
          type="welcome"
          base_url="welcome"
          onRenderItem={this.renderItem}
          columns={columns}
          bulk_actions={bulkActions}
          item_actions={newsletterActions}
          messages={messages}
          auto_refresh
          sort_by="updated_at"
          sort_order="desc"
          afterGetItems={(state) => { this.checkMailerStatus(state); this.checkCronStatus(state); }}
        />
      </div>
    );
  },
});

export default NewsletterListWelcome;
