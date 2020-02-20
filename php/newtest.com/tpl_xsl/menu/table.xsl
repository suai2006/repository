<?xml version="1.0" ?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:template name="table" >
	<div class="main__content">
		<table>
			<tr class="th">
				<th style="text-align:left">id</th>
				<th style="text-align:left">Фамилия</th>
				<th style="text-align:left">Имя</th>
				<th style="text-align:left">Отчество</th>
				<th style="text-align:left">e-mail</th>
				<th style="text-align:left">телефон</th>
			</tr>
			<xsl:for-each select="pageinfo/userlist/user">
			<tr>
				<td><xsl:value-of select="@id"/></td>
				<td><xsl:value-of select="@f_name"/></td>
				<td><xsl:value-of select="@i_name"/></td>
				<td><xsl:value-of select="@o_name"/></td>
				<td><xsl:value-of select="@email"/></td>
				<td><xsl:value-of select="@phone"/></td>
			</tr>
			</xsl:for-each>
		</table>
	</div>
	</xsl:template>
</xsl:stylesheet>