{
	"patcher" : 	{
		"fileversion" : 1,
		"appversion" : 		{
			"major" : 8,
			"minor" : 6,
			"revision" : 0,
			"architecture" : "x64",
			"modernui" : 1
		}
,
		"classnamespace" : "box",
		"rect" : [ 34.0, 100.0, 795.0, 983.0 ],
		"bglocked" : 0,
		"openinpresentation" : 0,
		"default_fontsize" : 12.0,
		"default_fontface" : 0,
		"default_fontname" : "Arial",
		"gridonopen" : 1,
		"gridsize" : [ 15.0, 15.0 ],
		"gridsnaponopen" : 1,
		"objectsnaponopen" : 1,
		"statusbarvisible" : 2,
		"toolbarvisible" : 1,
		"lefttoolbarpinned" : 0,
		"toptoolbarpinned" : 0,
		"righttoolbarpinned" : 0,
		"bottomtoolbarpinned" : 0,
		"toolbars_unpinned_last_save" : 0,
		"tallnewobj" : 0,
		"boxanimatetime" : 200,
		"enablehscroll" : 1,
		"enablevscroll" : 1,
		"devicewidth" : 0.0,
		"description" : "",
		"digest" : "",
		"tags" : "",
		"style" : "",
		"subpatcher_template" : "",
		"assistshowspatchername" : 0,
		"boxes" : [ 			{
				"box" : 				{
					"border" : 0,
					"filename" : "ui.js",
					"id" : "obj-1",
					"maxclass" : "jsui",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"parameter_enable" : 0,
					"patching_rect" : [ 135.0, 150.0, 520.0, 192.0 ]
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-4",
					"maxclass" : "newobj",
					"numinlets" : 2,
					"numoutlets" : 0,
					"patching_rect" : [ 135.0, 390.0, 36.0, 22.0 ],
					"text" : "dac~"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-3",
					"maxclass" : "newobj",
					"numinlets" : 1,
					"numoutlets" : 2,
					"outlettype" : [ "signal", "signal" ],
					"patcher" : 					{
						"fileversion" : 1,
						"appversion" : 						{
							"major" : 8,
							"minor" : 6,
							"revision" : 0,
							"architecture" : "x64",
							"modernui" : 1
						}
,
						"classnamespace" : "dsp.gen",
						"rect" : [ 898.0, 100.0, 796.0, 983.0 ],
						"bglocked" : 0,
						"openinpresentation" : 0,
						"default_fontsize" : 12.0,
						"default_fontface" : 0,
						"default_fontname" : "Arial",
						"gridonopen" : 1,
						"gridsize" : [ 15.0, 15.0 ],
						"gridsnaponopen" : 1,
						"objectsnaponopen" : 1,
						"statusbarvisible" : 2,
						"toolbarvisible" : 1,
						"lefttoolbarpinned" : 0,
						"toptoolbarpinned" : 0,
						"righttoolbarpinned" : 0,
						"bottomtoolbarpinned" : 0,
						"toolbars_unpinned_last_save" : 0,
						"tallnewobj" : 0,
						"boxanimatetime" : 200,
						"enablehscroll" : 1,
						"enablevscroll" : 1,
						"devicewidth" : 0.0,
						"description" : "",
						"digest" : "",
						"tags" : "",
						"style" : "",
						"subpatcher_template" : "",
						"assistshowspatchername" : 0,
						"boxes" : [ 							{
								"box" : 								{
									"id" : "obj-6",
									"maxclass" : "newobj",
									"numinlets" : 1,
									"numoutlets" : 0,
									"patching_rect" : [ 750.0, 945.0, 35.0, 22.0 ],
									"text" : "out 2"
								}

							}
, 							{
								"box" : 								{
									"code" : "ar(trig, attack, release) {\n    History env(0), stage(0);\n        \n    if (trig) {                       \r\n        env = 0; \n        hld_state = 0;\n        stage = 1;\n    }   \n\n    if (stage == 0) {\n        env = 0;\n    } else if (stage == 1) {\r\n\t\tatk_rate = samplerate * attack;\r\n\t\tatk_offset = 1 / atk_rate;\r\n\n        env = atk_offset + env;\n        \n        if (env >= 1 || attack <= 0) {\n            env = 1;\n            stage = 2;\n        }\n    } else {\r\n\t\trel_rate = samplerate * release;\r\n\t\t\r\n\t\trel_slope = exp(-8);\r\n\t\trel_coeff = exp(-log((1 + rel_slope) / rel_slope) / rel_rate);\n        rel_offset = -rel_slope * (1 - rel_coeff);\r\n\t\n        env = rel_offset + env * rel_coeff;\n        \n        if (env <= 0 || release <= 0) {\n            env = 0;\n            stage = 0;\n        }\n    }\n    return env;\n}\r\n\r\nade(trig, attack, decay, end) {\n    History env(0), stage(0);\n        \n    if (trig) {                       \r\n        env = 0; \n        hld_state = 0;\n        stage = 1;\n    }   \n\n    if (stage == 0) {\n        // idle\n    } else if (stage == 1) {\r\n\t\tatk_rate = samplerate * attack;\r\n\t\tatk_offset = 1 / atk_rate;\r\n\n        env = atk_offset + env;\n        \n        if (env >= 1 || attack <= 0) {\n            env = 1;\n            stage = 2;\n        }\n    } else {\r\n\t\tfall_slope = exp(-8);\r\n\t\r\n\t\tdec_rate = samplerate * decay;\r\n\t\tdec_coeff = exp(-log((1 + fall_slope) / fall_slope) / dec_rate);\n\t\tdec_offset = (end - fall_slope) * (1 - dec_coeff);\r\n\r\n\t\tenv = dec_offset + env * dec_coeff;\n        \n        if (env <= end || decay <= 0) {\n            env = end;\n            stage = 0;\n        }\n    }\n    return env;\n}\r\n\r\nph(trig, freq) {\r\n\tHistory phase;\r\n\t\r\n\tphase += freq / samplerate;\r\n\tphase -= phase >= 1;\r\n\tphase *= !trig;\r\n\t\r\n\treturn phase;\r\n}\r\n\r\nop(trig, freq, mult, pm, fbk, dec, end) {\r\n\tHistory fb, osc;\r\n\t\r\n\tenv = ade(trig, 0.001, dec, end);\r\n\t\r\n\tphase = ph(trig, freq * mult);\t\r\n\tosc = cycle(phase + pm + fb, index = \"phase\") * env;\r\n\tfb = osc * fbk;\r\n\t\r\n\treturn osc;\r\n}\r\n\r\nkick(trig) {\r\n\tHistory t;\r\n\t\r\n\tt = t >= 16 ? 0 : t + trig;\r\n\ttn = t > 13;\r\n\t\r\n\tfrq_env = ar(trig, 0, 0.125);\t\r\n\tfreq = mtof(29 + frq_env * (tn ? 12 : 48) + (tn ? 12 : 0));\t\t\t\r\n\t\r\n\tamp_env = ar(trig, 0.0001, 0.31);\r\n\t\r\n\top2 = op(trig, freq, 4, 0, 0, 0.1, 0.075);\r\n\top1 = op(trig, freq, 2, 0.25, 0.45, 0.04, 0.2);\r\n\top0 = op(trig, freq, 1, op1 * 0.1 + op2 * 0.1, 0, 0, 1) * amp_env;\r\n\t\r\n\treturn op0;\r\n}\r\n\r\nrim(trig) {\r\n\tHistory t;\r\n\t\r\n\tt = t >= 32 ? 0 : t + trig;\r\n\ttn = t > 28;\r\n\t\r\n\tfreq = mtof(54);\r\n\t\r\n\tamp_env = ar(trig, 0.00001, 0.04 + (tn ? 0.1 : 0));\r\n\t\r\n\top2 = op(trig, freq, 2.5, 0.125, 0.2, 0.035, 0.1);\r\n\top1 = op(trig, freq, 3, 0, 0.2, 0.05, 0.1);\r\n\top0 = op(trig, freq, 4, op1 * 0.5 + op2 * 1, 0, 0, 1) * amp_env;\r\n\t\r\n\treturn op0;\r\n}\r\n\r\nhat(trig) {\r\n\tHistory t;\r\n\t\r\n\tt = t >= 6 ? 0 : t + trig;\r\n\t\r\n\tfreq = mtof(84 + t * 7);\t\t\t\r\n\t\r\n\tamp_env = ar(trig, 0.001, 0.05);\r\n\t\r\n\top2 = op(trig, freq, 1.725, 0, 0, 0, 1);\r\n\top1 = op(trig, freq, 0.45, 0.25, 0, 0, 1);\r\n\top0 = op(trig, freq, 8, op1 * 0.45 + op2 * 0.1, 0, 0, 1) * amp_env;\r\n\r\n\treturn op0;\r\n}\r\n\r\nsvf(xin, cf, q) {\n    History y0(0), y1(0), lp(0), hp(0), bp(0);\n\n    g = tan(cf * pi / samplerate);\n    \n    r = 1 / q;\n    \n    h = 1 / (1 + r * g + g * g);\n    rpg = r + g;\n\n    hp = (xin - rpg * y0 - y1) * h;\n    bp = g * hp + y0;\n    y0 = g * hp + bp;\n    lp = g * bp + y1;\n    y1 = g * bp + lp;\n\n    return lp, bp, hp;\n}\r\n\r\nclap(trig) {\r\n\tamp_env = wrap(ar(trig, 0, 0.2) * 4, 0, 1);\t\r\n\tlp, bp, hp = svf(noise(), 1400, 2);\r\n\t\r\n\treturn (bp + hp * 0.35) * amp_env * 1.2;\r\n}\r\n\r\nch(trig, note) {\r\n\tHistory op0, op1, op2;\r\n\t\r\n\tfreq = mtof(49 + note);\r\n\t\r\n\tamp_env = ar(trig, 0.5, 2);\r\n\r\n\top2 = op(trig, freq, 3, 0.25, 0, 4, 0);\r\n\top1 = op(trig, freq, 2, op2 * 3, 0, 1, 0.25);\r\n\top0 = op(trig, freq, 1, 0.25 + op1 * 0.5, 0, 0, 1) * amp_env;\r\n\t\r\n\treturn op0 * 0.25;\r\n}\r\n\r\neuclid(metro, t, length, density, offset) {\r\n\tHistory trig;\r\n\t\r\n\tlength = round(length * 16);\r\n\tdensity = round(density * length);\r\n\toffset = round(offset * length);\r\n\tstep = ((t + length) - offset) * density;\r\n\t\r\n\tif (metro) {\r\n\t\ttrig = (step % length) < density; \r\n\t} else {\r\n\t\ttrig = 0;\r\n\t}\r\n\treturn trig;\r\n}\r\n\r\nHistory t, c;\r\nParam spring, d0, o0, d1, o1, l0, l1;\r\n\r\nmetro = delta(phasor(120 / 60 * 4)) < 0;\r\nt += metro;\r\n\r\ntrig0 = euclid(metro, t, l0, d0, o0);\r\ntrig1 = euclid(metro, t, l1, d1, o1);\r\ntrig3 = (metro * (trig0 + trig1) * 0.5) > 0.5;\r\ntrig2 = ((metro - (trig0 + trig1)) > 0) * !trig3;\r\n\r\nc = c >= 6 ? 0 : c + trig3;\r\n\r\nch_trig = c % 6 ? trig3 : 0;\r\ncp_trig = c % 6 ? 0 : trig3;\r\n\r\nbd = kick(trig0);\r\nrs = rim(trig1) * 2;\r\nhh = hat(trig2);\r\ncp = clap(cp_trig);\r\n\r\ntr = 5;\r\n\r\nchord = ch(ch_trig, -5 + tr);\r\nchord += ch(ch_trig, 2 + tr);\r\nchord += ch(ch_trig, 5 + tr);\r\nchord += ch(ch_trig, 9 + tr);\r\nchord += ch(ch_trig, 10 + tr);\r\n\r\nout_l = bd + rs + hh + cp + chord;\r\nout_l = tanh(out_l);\r\n\r\nout1 = out_l;\r\nout2 = out_l;",
									"fontface" : 0,
									"fontname" : "<Monospaced>",
									"fontsize" : 12.0,
									"id" : "obj-5",
									"maxclass" : "codebox",
									"numinlets" : 1,
									"numoutlets" : 2,
									"outlettype" : [ "", "" ],
									"patching_rect" : [ 15.0, 45.0, 754.0, 885.0 ]
								}

							}
, 							{
								"box" : 								{
									"id" : "obj-1",
									"maxclass" : "newobj",
									"numinlets" : 0,
									"numoutlets" : 1,
									"outlettype" : [ "" ],
									"patching_rect" : [ 15.0, 15.0, 28.0, 22.0 ],
									"text" : "in 1"
								}

							}
, 							{
								"box" : 								{
									"id" : "obj-4",
									"maxclass" : "newobj",
									"numinlets" : 1,
									"numoutlets" : 0,
									"patching_rect" : [ 15.0, 945.0, 35.0, 22.0 ],
									"text" : "out 1"
								}

							}
 ],
						"lines" : [ 							{
								"patchline" : 								{
									"destination" : [ "obj-5", 0 ],
									"source" : [ "obj-1", 0 ]
								}

							}
, 							{
								"patchline" : 								{
									"destination" : [ "obj-4", 0 ],
									"source" : [ "obj-5", 0 ]
								}

							}
, 							{
								"patchline" : 								{
									"destination" : [ "obj-6", 0 ],
									"source" : [ "obj-5", 1 ]
								}

							}
 ]
					}
,
					"patching_rect" : [ 135.0, 360.0, 36.0, 22.0 ],
					"text" : "gen~",
					"varname" : "dsp"
				}

			}
 ],
		"lines" : [ 			{
				"patchline" : 				{
					"destination" : [ "obj-3", 0 ],
					"source" : [ "obj-1", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-4", 1 ],
					"source" : [ "obj-3", 1 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-4", 0 ],
					"source" : [ "obj-3", 0 ]
				}

			}
 ],
		"dependency_cache" : [ 			{
				"name" : "ui.js",
				"bootpath" : "~/Dev/fors/jsui-c74",
				"patcherrelativepath" : ".",
				"type" : "TEXT",
				"implicit" : 1
			}
 ],
		"autosave" : 0
	}

}
