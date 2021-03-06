import '../../src/index'
import {setup} from '../../src/setup'
import * as TestUtils from 'playkit-js/test/src/utils/test-utils'
import StorageWrapper from '../../src/common/storage/storage-wrapper'

const targetId = 'player-placeholder_setup.spec';

describe('setup', function () {
  let config, kalturaPlayer, sandbox;
  const entryId = '1_h14v9eug';
  const partnerId = 2196781;

  before(function () {
    TestUtils.createElement('DIV', targetId);
  });

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    config = {
      targetId: targetId,
      provider: {
        partnerId: partnerId
      }
    };
  });

  afterEach(function () {
    sandbox.restore();
    kalturaPlayer = null;
    TestUtils.removeVideoElementsFromTestPage();
  });

  after(function () {
    TestUtils.removeElement(targetId);
  });

  it('should create a full player', function (done) {
    kalturaPlayer = setup(config);
    kalturaPlayer.loadMedia.should.exist;
    kalturaPlayer.loadMedia({entryId: entryId})
      .then(() => {
        kalturaPlayer.config.id.should.equal(entryId);
        kalturaPlayer.config.session.partnerId.should.equal(partnerId);
        done();
      });
  });

  it('should create an empty player', function () {
    kalturaPlayer = setup(config);
    (!kalturaPlayer.config.id).should.be.true;
  });

  it('should decorate the selected source by session id', function (done) {
    kalturaPlayer = setup(config);
    kalturaPlayer.loadMedia.should.exist;
    kalturaPlayer.loadMedia({entryId: entryId})
      .then(() => {
        kalturaPlayer.ready().then(() => {
          let sessionIdRegex = /playSessionId=((?:[a-z0-9]|-|:)*)/i;
          sessionIdRegex.exec(kalturaPlayer.src)[1].should.equal(kalturaPlayer.config.session.id);
          done();
        });
        kalturaPlayer.load();
      });
  });

  it('should set text style from storage', function () {
    let textStyle = {
      "fontSize": "20%",
      "fontFamily": "sans-serif",
      "fontColor": [14, 15, 0],
      "fontOpacity": 0,
      "backgroundColor": [1, 2, 3],
      "backgroundOpacity": 1,
      "fontEdge": []
    };
    sandbox.stub(StorageWrapper, 'getItem').withArgs('textStyle').returns(textStyle);
    kalturaPlayer = setup(config);
    kalturaPlayer.textStyle.should.deep.equal(textStyle);
  });
});
