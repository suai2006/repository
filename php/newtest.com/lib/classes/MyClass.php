<?php

class MyClass {
	private $date;
	private $table;
	private $where;
	private $order;

	public function __construct($param1,$param2,$param3,$param4) {
		$this->date	 =$param1;
		$this->table =$param2;
		$this->where =$param3;
		$this->order =$param4;
	}

	public function select(){
		return	"SELECT ".$this->date."	FROM ".$this->table." WHERE ".$this->where." ORDER BY ".$this->order;
	}

}
