<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:template match="/" name="menu-link">
			<ul class="menu">
				<xsl:for-each select="pageinfo/userlist/user">
					<li class="menu-li">
						<xsl:apply-templates select="."/>
					</li>
				</xsl:for-each>
			</ul>
	</xsl:template>
	<xsl:template match="pageinfo/userlist/user" >
		<a class="menu-link">
			<xsl:attribute name="href">
				<xsl:text>index.php?id=</xsl:text>
				<xsl:value-of select='id'/>
			</xsl:attribute>
			<xsl:attribute name="title">
				<xsl:value-of select="i_name" />
			</xsl:attribute>
			<xsl:value-of select="i_name" />
		</a>
	</xsl:template>
</xsl:stylesheet>
