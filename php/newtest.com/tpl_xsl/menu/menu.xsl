<?xml version="1.0" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="/" name="menu">
	<ul class="menu">
		<xsl:apply-templates select="pageinfo/menu/link[@parent=0]"/>
	</ul>
</xsl:template>
<!-- Шаблон вывода меню -->
<xsl:template match="pageinfo/menu/link">
	<xsl:variable name="id" select="@id"/>
	<!-- Вывод элемента меню -->
	<li class="menu-li">
		<a class="menu-link" href="/{@uri}">
			<xsl:value-of select="@pagetitle"/>
		</a>
		<!-- Если существют подпункты -->
		<xsl:if test="/pageinfo/menu/link[@parent=$id]">
			<ul class="submenu">
				<xsl:apply-templates select="/pageinfo/menu/link[@parent=$id]"/>
			</ul>
		</xsl:if>
	</li>
</xsl:template>
</xsl:stylesheet>