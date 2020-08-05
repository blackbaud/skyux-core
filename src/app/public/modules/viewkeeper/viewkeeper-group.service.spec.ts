import {
  SkyViewkeeperGroupService
} from './viewkeeper-group.service';

describe('Viewkeeper group service', () => {
  let hostEl: HTMLDivElement;
  let el1: HTMLDivElement;
  let el2: HTMLDivElement;
  let el3: HTMLDivElement;
  let el4: HTMLDivElement;

  beforeEach(() => {
    hostEl = document.createElement('div');

    hostEl.innerHTML = `
<div class="vk-group-test-outer">
  <div class="vk-group-test-1">
    <div class="vk-group-test-2"></div>
    <div class="vk-group-test-3"></div>
  </div>
  <div class="vk-group-test-4"></div>
</div>
`;

    document.body.appendChild(hostEl);

    el1 = hostEl.querySelector('.vk-group-test-1');
    el2 = hostEl.querySelector('.vk-group-test-2');
    el3 = hostEl.querySelector('.vk-group-test-3');
    el4 = hostEl.querySelector('.vk-group-test-4');
  });

  afterEach(() => {
    document.body.removeChild(hostEl);

    hostEl =
      el1 =
      el2 =
      el3 =
      el4 =
      undefined;
  });

  it('should return elements in DOM order regardless of input order', () => {
    const svc = new SkyViewkeeperGroupService();

    svc.setViewkeeperEls(
      'test1',
      [
        el3
      ]
    );

    svc.setViewkeeperEls(
      'test2',
      [
        el2,
        el4,
        el1
      ]
    );

    const viewkeeperEls = svc.getGroupViewkeeperEls();

    expect(viewkeeperEls).toEqual([
      el1,
      el2,
      el3,
      el4
    ]);
  });

});
