<script>
export default {
  name: 'UserInfo',
};
</script>

<template>
  <Dropdown
    class="user-info">
    <Avatar
      icon="person"
      size="small"/>
    <Icon type="arrow-down-b"></Icon>
    <DropdownMenu slot="list">
      <DropdownItem name="userInfo">个人信息</DropdownItem>
      <DropdownItem name="changePasswd">修改密码</DropdownItem>
    </DropdownMenu>
  </Dropdown>
</template>

<style lang="less" scoped>
.user-info {
  margin-right: 30px;
  cursor: pointer;
}
</style>
