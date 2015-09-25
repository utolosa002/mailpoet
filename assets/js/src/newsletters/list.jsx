define(
  [
    'react',
    'listing/listing.jsx',
    'classnames'
  ],
  function(
    React,
    Listing,
    classNames
  ) {
    var columns = [
      {
        name: 'subject',
        label: 'Subject',
        sortable: true
      },
      {
        name: 'created_at',
        label: 'Created on',
        sortable: true
      },
      {
        name: 'updated_at',
        label: 'Last modified on',
        sortable: true
      }
    ];

    var bulk_actions = [
      {
        name: 'trash',
        label: 'Trash'
      }
    ];

    var item_actions = [
      {
        name: 'edit',
        label: 'Edit',
        link: function(id) {
          return '?page=mailpoet-newsletter-editor&id='+parseInt(id, 10);
        }
      }
    ];

    var NewsletterList = React.createClass({
      renderItem: function(newsletter, actions) {

        var rowClasses = classNames(
          'manage-column',
          'column-primary',
          'has-row-actions'
        );

        return (
          <div>
            <td className={ rowClasses }>
              <strong>
                <a>{ newsletter.subject }</a>
              </strong>
              { actions }
            </td>
            <td className="column-date" data-colname="Subscribed on">
              <abbr>{ newsletter.created_at }</abbr>
            </td>
            <td className="column-date" data-colname="Last modified on">
              <abbr>{ newsletter.updated_at }</abbr>
            </td>
          </div>
        );
      },
      render: function() {
        return (
          <Listing
            endpoint="newsletters"
            onRenderItem={this.renderItem}
            columns={columns}
            bulk_actions={ bulk_actions }
            item_actions={ item_actions } />
        );
      }
    });

    return NewsletterList;
  }
);