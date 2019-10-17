* 全局只有一个焦点Panel，但是每个布局都存在一个activeGroup
* Panel的“焦点”目前只作为热区的转移，并没有相关事件
* focus()只有在用户操作行为下才会调用，其他API的调用并不会转移focus
* TabGroup与DocumentGroup是平级视图，更改拖拽逻辑时都要考虑
* Panel的对外周期目前有：
    * onCreate ：API
    * onAdd ：API、交互
    * onRemoving ：交互
    * onRemove ：API，交互
    * onResize ：API，交互