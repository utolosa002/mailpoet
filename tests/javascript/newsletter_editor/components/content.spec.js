define('test/newsletter_editor/components/content', [
    'newsletter_editor/App',
    'newsletter_editor/components/content'
  ], function(EditorApplication) {

  describe('Content', function() {
      describe('newsletter model', function() {
          var model;

          beforeEach(function() {
              model = new (EditorApplication.module('components.content').NewsletterModel)({
                  styles: {
                      style1: 'style1Value',
                      style2: 'style2Value',
                  },
                  data: {
                      data1: 'data1Value',
                      data2: 'data2Value',
                  },
                  someField: 'someValue'
              });
          });

          it('triggers autosave on change', function() {
              var mock = sinon.mock({ trigger: function() {} }).expects('trigger').once().withArgs('autoSave');
              global.stubChannel(EditorApplication, {
                  trigger: mock,
              });
              model.set('someField', 'anotherValue');
              mock.verify();
          });

          it('does not include styles and data attributes in its JSON', function() {
              var json = model.toJSON();
              expect(json).to.deep.equal({someField: 'someValue'});
          });
      });

      describe('block types', function() {
          it('registers a block type view and model', function() {
              var blockModel = new Backbone.SuperModel(),
                  blockView = new Backbone.View();
              EditorApplication.module('components.content').registerBlockType('testType', {
                  blockModel: blockModel,
                  blockView: blockView,
              });
              expect(EditorApplication.module('components.content').getBlockTypeModel('testType')).to.deep.equal(blockModel);
              expect(EditorApplication.module('components.content').getBlockTypeView('testType')).to.deep.equal(blockView);
          });
      });

      describe('transformation to json', function() {
          it('includes data, styles and initial newsletter fields', function() {
              var dataField = {
                  containerModelField: 'containerModelValue',
              }, stylesField = {
                  globalStylesField: 'globalStylesValue',
              }, newsletterFields = {
                  newsletter_subject: 'test newsletter subject',
              };
              EditorApplication._contentContainer = {
                  toJSON: function() {
                      return dataField;
                  }
              };
              EditorApplication.getGlobalStyles = function() {
                  return {
                      toJSON: function() {
                          return stylesField;
                      },
                  };
              };
              EditorApplication.getNewsletter = function() {
                  return {
                      toJSON: function() {
                          return newsletterFields;
                      },
                  };
              };
              var json = EditorApplication.module('components.content').toJSON();
              expect(json).to.deep.equal(_.extend({
                  data: dataField,
                  styles: stylesField
              }, newsletterFields));
          });
      });
  });
});
