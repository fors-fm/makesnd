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
		"rect" : [ 443.0, 348.0, 796.0, 526.0 ],
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
					"id" : "obj-10",
					"maxclass" : "ezdac~",
					"numinlets" : 2,
					"numoutlets" : 0,
					"patching_rect" : [ 135.0, 405.0, 36.0, 36.0 ]
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-5",
					"maxclass" : "newobj",
					"numinlets" : 1,
					"numoutlets" : 2,
					"outlettype" : [ "float", "bang" ],
					"patching_rect" : [ 195.0, 375.0, 159.0, 22.0 ],
					"text" : "buffer~ playhead @samps 1"
				}

			}
, 			{
				"box" : 				{
					"border" : 0,
					"filename" : "makesnd.js",
					"id" : "obj-1",
					"maxclass" : "jsui",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"parameter_enable" : 0,
					"patching_rect" : [ 135.0, 135.0, 525.0, 195.0 ]
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
									"id" : "obj-3",
									"maxclass" : "newobj",
									"numinlets" : 1,
									"numoutlets" : 0,
									"patching_rect" : [ 15.0, 945.0, 35.0, 22.0 ],
									"text" : "out 1"
								}

							}
, 							{
								"box" : 								{
									"id" : "obj-2",
									"maxclass" : "newobj",
									"numinlets" : 1,
									"numoutlets" : 0,
									"patching_rect" : [ 750.0, 945.0, 35.0, 22.0 ],
									"text" : "out 2"
								}

							}
, 							{
								"box" : 								{
									"code" : "/*\nMIT License\n\nCopyright (c) 2024 Ess Mattisson (ess@fors.fm)\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\r\n\r\n              ,-.\n             /  (  '\n     *  _.--'!   '--._\n      ,'              ''.\n'    |!                   \\\n   _.'  o      ___       ! .\n  (_.-^, __..-'  ''''--.   )\n      /,'        '    _.' /\n   '         *    .-''    |\n                 (..--^.  ' \n                       | /\n                       '*\r\n*/\r\n\r\nar(trig, attack, release) {\n    History env(0), stage(0);\n        \n    if (trig) {                       \r\n        env = 0; \n        hld_state = 0;\n        stage = 1;\n    }   \n\n    if (stage == 0) {\n        env = 0;\n    } else if (stage == 1) {\r\n\t\tatk_rate = samplerate * attack;\r\n\t\tatk_offset = 1 / atk_rate;\r\n\n        env = atk_offset + env;\n        \n        if (env >= 1 || attack <= 0) {\n            env = 1;\n            stage = 2;\n        }\n    } else {\r\n\t\trel_rate = samplerate * release;\r\n\t\t\r\n\t\trel_slope = exp(-8);\r\n\t\trel_coeff = exp(-log((1 + rel_slope) / rel_slope) / rel_rate);\n        rel_offset = -rel_slope * (1 - rel_coeff);\r\n\t\n        env = rel_offset + env * rel_coeff;\n        \n        if (env <= 0 || release <= 0) {\n            env = 0;\n            stage = 0;\n        }\n    }\n    return env;\n}\r\n\r\nade(trig, attack, decay, end) {\n    History env(0), stage(0);\n        \n    if (trig) {                       \r\n        env = 0; \n        hld_state = 0;\n        stage = 1;\n    }   \n\n    if (stage == 0) {\n        // idle\n    } else if (stage == 1) {\r\n\t\tatk_rate = samplerate * attack;\r\n\t\tatk_offset = 1 / atk_rate;\r\n\n        env = atk_offset + env;\n        \n        if (env >= 1 || attack <= 0) {\n            env = 1;\n            stage = 2;\n        }\n    } else {\r\n\t\tfall_slope = exp(-8);\r\n\t\r\n\t\tdec_rate = samplerate * decay;\r\n\t\tdec_coeff = exp(-log((1 + fall_slope) / fall_slope) / dec_rate);\n\t\tdec_offset = (end - fall_slope) * (1 - dec_coeff);\r\n\r\n\t\tenv = dec_offset + env * dec_coeff;\n        \n        if (env <= end || decay <= 0) {\n            env = end;\n            stage = 0;\n        }\n    }\n    return env;\n}\r\n\r\nparabola(phase) {\r\n\tphase = 0.5 - phase;\r\n\treturn phase * (8 - 16 * abs(phase));\r\n}\r\n\r\nlfo(freq) {\r\n\tHistory phase(0);\r\n\tphase_inc = freq / samplerate;\r\n\t\r\n\tphase += phase_inc;\r\n\tphase -= phase >= 1;\r\n\t\r\n\treturn parabola(phase);\r\n}\r\n\r\n/*\r\nnormalized & tunable sigmoid function by dale emery:\r\nhttps://dhemery.github.io/DHE-Modules/technical/sigmoid/\r\n*/\r\n\r\nsigmoid(x, y) {\r\n\treturn (x - x * y) / (y - abs(x) * 2 * y + 1);\r\n}\r\n\r\ntan_a(x) {\r\n\tx2 = x * x;\r\n\t\r\n\treturn x * (0.999999492001 + x2 * -0.096524608111) /\r\n\t(1 + x2 * (-0.429867256894 + x2 * 0.009981877999));\r\n}\r\n\r\n/*\r\nsvf by emilie gillet\r\nhttps://github.com/pichenettes/stmlib/blob/master/dsp/filter.h\r\n*/\r\n\r\nsvf(xin, cf, q) {\n    History y0(0), y1(0), lp(0), hp(0), bp(0);\n\n    g = tan_a(cf * pi / samplerate);\n    \n    r = 1 / q;\n    \n    h = 1 / (1 + r * g + g * g);\n    rpg = r + g;\n\n    hp = (xin - rpg * y0 - y1) * h;\n    bp = g * hp + y0;\n    y0 = g * hp + bp;\n    lp = g * bp + y1;\n    y1 = g * bp + lp;\n\n    return lp, bp, hp;\n}\r\n\r\nallpass(xin, time, g) {\r\n\tDelay d(131072);\n    z = d.read(time, interp = \"linear\");\n\n    x = xin + z * g;\n    y = z + x * -g;\n\n    d.write(x);\n\n    return y;\n}\r\n\r\npre_diffuse(xin, time, lcut, hcut, lfo0, lfo1, lfo2) {\r\n\tlp0, hp0 = svf(xin, lcut, 0.5);\r\n\tlp1, hp1 = svf(hp0, clip(hcut * 1.5, 0, 11000), 0.5);\r\n\t\r\n\tg = 0.3;\r\n\t\r\n\tap0 = allpass(lp1, time * 2 + lfo1, g);\r\n\tap1 = allpass(ap0, time * 3 + lfo2, g);\r\n\tap2 = allpass(ap1, time * 5 + lfo0, g);\r\n\tap3 = allpass(ap2, time * 7 + lfo1, g);\r\n\tap4 = allpass(ap3, time * 11 + lfo2, g);\r\n\t\r\n\treturn ap4;\r\n}\r\n\r\ndiffuse(xin, time, lfo0, lfo1, lfo2) {\r\n\tlp, hp = svf(xin, 200, 0.5);\r\n\t\r\n\tg = 0.3;\r\n\t\r\n\tap0 = allpass(hp, time * 2 + lfo2, g);\r\n\tap1 = allpass(ap0, time * 3 + lfo1, g);\r\n\tap2 = allpass(ap1, time * 5 + lfo0, g);\r\n\tap3 = allpass(ap2, time * 7 + lfo2, g);\r\n\t\r\n\tap4 = allpass(ap3, time * 11 + lfo1, g);\r\n\tap5 = allpass(ap3, time * 13 + lfo2, g);\r\n\t\r\n\treturn ap4, ap5;\r\n}\t\r\n\r\nap_loop(xin, time, fbk, lcut, hcut, lfo0, lfo1, lfo2) {\r\n\tDelay d0(131072);\r\n\tHistory fb(0);\r\n\t\r\n\tg = 0.5;\r\n\t\r\n\td0.write(fb * fbk);\r\n\ttap = d0.read(time, interp = \"linear\");\r\n\t\r\n\tap0 = allpass(tap + xin, time * 3 + lfo0, g);\r\n\tap1 = allpass(ap0, time * 7 + lfo1, g);\r\n\tap2 = allpass(ap1, time * 11 + lfo2, g);\r\n\tap3 = allpass(ap2, time * 19 + lfo0, g);\r\n\tap4 = allpass(ap3, time * 23 + lfo1, g);\r\n\t\r\n\tlp0, bp0, hp0 = svf(ap4, lcut, 0.5);\r\n\tlp1, bp1, hp1 = svf(hp0, hcut, 0.5);\r\n\t\r\n\tap5 = allpass(lp1, time * 31 + lfo2, g);\r\n\tap6 = allpass(lp1, time * 29 + lfo0, g);\r\n\t\r\n\tfb = ap5;\t\t\r\n\t\r\n\treturn ap5, ap6;\r\n}\r\n\r\nromb(xin, size, decay, locut, hicut) {\r\n\tsize = sigmoid(\r\n\t\tslide(size, 512, 512), 0.5) * mstosamps(6.666667) + mstosamps(3.333333);\r\n\tdecay = sigmoid(slide(decay, 128, 128), 0.5) * 0.998;\r\n\tlocut = sigmoid(slide(locut, 128, 128), 0.7) * 10800 + 200;\r\n\thicut = sigmoid(slide(hicut, 128, 128), 0.7) * 3900 + 100;\r\n\t\r\n\tlfo0 = lfo(0.9128) * 11;\r\n\tlfo1 = lfo(1.1341) * 9;\r\n\tlfo2 = lfo(1) * 10;\r\n\t\r\n\tpre_out = pre_diffuse(xin, 40, locut, hicut, lfo0, lfo1, lfo2);\r\n\tdiff_out_l, diff_out_r = diffuse(pre_out, size * 2, lfo0, lfo1, lfo2);\r\n\tloop_out_l, loop_out_r = ap_loop(pre_out, size, decay, locut, hicut, lfo0, lfo1, lfo2);\r\n\r\n\treturn diff_out_l * 0.7 + loop_out_l, diff_out_r * 0.7 + loop_out_r;\r\n}\r\n\r\nph(trig, freq) {\r\n\tHistory phase;\r\n\t\r\n\tphase += freq / samplerate;\r\n\tphase -= phase >= 1;\r\n\tphase *= !trig;\r\n\t\r\n\treturn phase;\r\n}\r\n\r\nop(trig, freq, mult, pm, fbk, dec, end) {\r\n\tHistory fb, osc;\r\n\t\r\n\tenv = ade(trig, 0.001, dec, end);\r\n\t\r\n\tphase = ph(trig, freq * mult);\t\r\n\tosc = cycle(phase + pm + fb, index = \"phase\") * env;\r\n\tfb = osc * fbk;\r\n\t\r\n\treturn osc;\r\n}\r\n\r\nop_soft(trig, freq, mult, pm, fbk, dec, end) {\r\n\tHistory fb0, fb1, osc0, osc1;\r\n\t\r\n\tmult_floor = floor(mult);\r\n\r\n\tm0 = (mult_floor - 1) % 2 + mult_floor;\r\n\tm1 = mult_floor % 2 + mult_floor;\r\n\t\r\n\tenv = ade(trig, 0.001, dec, end);\r\n\t\r\n\tphase0 = ph(trig, freq * m0);\t\r\n\tosc0 = cycle(phase0 + pm + fb0, index = \"phase\") * env;\r\n\tfb0 = osc0 * fbk;\r\n\t\r\n\tphase1 = ph(trig, freq * m1);\t\r\n\tosc1 = cycle(phase1 + pm + fb1, index = \"phase\") * env;\r\n\tfb1 = osc1 * fbk;\r\n\t\r\n\treturn mix(osc0, osc1, fold(mult - 1, 0, 1));\r\n}\r\n\r\norg(trig, freq) {\r\n\tamp_env = ar(trig, 0.01, 0.5);\t\r\n\top0 = op(trig, freq, 1, 0, 0, 0, 1);\r\n\t\r\n\treturn op0 * amp_env * 0.5;\r\n}\r\n\r\nkick(trig, cx, cy) {\r\n\tHistory t;\r\n\t\r\n\tt = t >= (cy > 0.5 ? 13 : 16) ? 0 : t + trig;\r\n\ttn = t > (cy > 0.5 ? 8 : 13);\r\n\t\r\n\tfrq_env = ar(trig, 0, 0.125);\t\r\n\tfreq = mtof(\r\n\t\t29 + frq_env * \r\n\t\t(tn ? 12 : 48) + \r\n\t\t(tn ? 17 - ((cy > 0.5 ? t - 8 : 0) * \r\n\t\tcx > 0.5 ? -1 : 1) : 0)\r\n\t);\t\t\t\r\n\t\r\n\tamp_env = ar(trig, 0.0001, 0.35 + cy * 1);\r\n\t\r\n\top2 = op_soft(trig, freq, 4 + cx * 8, 0, 0, 0.1 + cx * 0.2, 0.075);\r\n\top1 = op(trig, freq, 2, 0.25, 0.45 + cy * 0.75, 0.04 + cy * 0.1, 0.2 + cy * 0.2);\r\n\top0 = op(trig, freq, 1, op1 * 0.1 + op2 * 0.1, 0, 0, 1) * amp_env;\r\n\t\r\n\treturn op0;\r\n}\r\n\r\nrim(trig, trig2, cx, cy) {\r\n\tHistory t, ndec;\r\n\t\r\n\tt = t >= 32 ? 0 : t + trig;\r\n\ttn = t > 28;\r\n\t\r\n\tfreq = mtof(54 + cx * 12);\r\n\t\r\n\tif (trig && trig2) {\r\n\t\tndec = 0.015;\r\n\t} else if (trig && !trig2) {\r\n\t\tndec = 0;\r\n\t}\r\n\t\r\n\tamp_env = ar(trig, 0.00001, 0.04 + (tn ? 0.1 : 0));\r\n\t\r\n\top2 = op(trig, freq, 2.5, 0.125, 0.2, 0.035, 0.1);\r\n\top1 = op_soft(trig, freq, 3 + cx * 5, 0, 0.2, 0.05, 0.1);\r\n\top0 = op(trig, freq, 4, op1 * 0.5 + op2 * 1, 0, 0, 1) * amp_env;\r\n\t\r\n\tlp, bp, hp = svf(noise(), 2000, 1);\r\n\tnoisy = (bp + hp * 0.5) * ar(trig, 0, 0.03 + ndec + cy * 0.1);\r\n\t\r\n\treturn op0 + noisy;\r\n}\r\n\r\nsnare(trig, cx, cy) {\r\n\tfrq_env = ar(trig, 0, 0.03);\r\n\tfreq = mtof(67 + frq_env * 12);\r\n\t\r\n\tamp_env = ar(trig, 0.00001, 0.09 + cy * 0.1);\r\n\t\r\n\tlen = latch(abs(noise()), trig) * 0.1;\r\n\t\r\n\top1 = op_soft(trig, freq, 1.25, 0, 0.2, 0.2, 0.1);\r\n\top0 = op(trig, freq, 1, op1 * 0.35, 0, 0, 1) * amp_env;\r\n\top0 += op(trig, freq, 5, op1 * 0.2, 0, 0, 1) * amp_env * 0.5;\r\n\t\r\n\tlp, bp, hp = svf(noise(), 1500, 2);\r\n\tnoisy = (bp + hp * 0.5) * ar(trig, 0.005, 0.125 + len);\r\n\t\r\n\treturn (op0 + noisy) * 1.5;\r\n}\r\n\r\nhat(trig, skew, move, cx, cy) {\r\n\tHistory t;\r\n\t\r\n\tsms = mstosamps(1000);\r\n\tskew = slide(skew * 2 - 1, sms, sms);\r\n\tmove = slide(move * 2 - 1, sms, sms);\r\n\t\r\n\tt = t >= (cx > 0.5 ? 4 : 6) ? 0 : t + trig;\r\n\t\r\n\tfreq = mtof(84 + t * 7 * -skew * move);\t\r\n\t\r\n\tamp_env = ar(trig, 0.001 + max(-move, 0) * 0.01, 0.05 + cy * 0.1);\r\n\t\r\n\top2 = op(trig, freq, 1.725 + cx * 1, 0, 0, 0.2, 1 - cx * 0.75);\r\n\top1 = op(trig, freq, 0.45 + cy * 0.75, 0.25, 0, 0.2, 1 - cx * 0.75);\r\n\top0 = op_soft(trig, freq, 8, op1 * 0.45 + op2 * 0.1, cx * 0.2, 0, 1) * amp_env;\r\n\r\n\treturn op0;\r\n}\r\n\r\nclap(trig, cx, cy) {\r\n\tamp_env = wrap(ar(trig, 0, 0.2 + cx * 0.5) * 4, 0, 1);\t\r\n\tlp, bp, hp = svf(noise(), 1400 + cy * 1000, 2);\r\n\t\r\n\treturn (bp + hp * 0.35) * amp_env * 1.2;\r\n}\r\n\r\nchord(trig, note, skew, move, cube_x, cube_y) {\r\n\tHistory op0, op1, op2, t;\r\n\t\r\n\tsms = mstosamps(1000);\r\n\t\r\n\tskew = slide(skew, sms, sms);\r\n\tmove = slide(move, sms, sms);\r\n\tcube_y = slide(cube_y, sms, sms);\r\n\t\r\n\tt = t >= 63 ? 0 : t + trig;\r\n\t\r\n\ttn = latch(cube_y > 0.5 ? (cube_y > 0.8 ? -5 : 0) : 3, trig);\t\r\n\ttr = latch(cube_x > 0.5 ? (cube_x > 0.8 ? 5 : -2) : -4, trig);\r\n\t\r\n\tfreq = mtof(49 + note + (t > 31 ? tr : tn));\r\n\t\r\n\tamp_env = ar(trig, 0.5 - cube_y * 0.48, 2 + (1 - move) * 2 + (cube_y * 2 - 1));\r\n\t\r\n\top4 = op_soft(trig, freq, 12, 0, 0, 1, 0.5) * cube_x;\r\n\top3 = op_soft(trig, freq, 9 - (move * 5) + skew * 2, 0, 0, 8 - cube_y * 4, 0);\r\n\top2 = op_soft(\r\n\t\ttrig, \r\n\t\tfreq + (3 * (1 - move) * cube_x), \r\n\t\t3, 0.25, 0, 4 - cube_y * 2, 0);\r\n\top1 = op_soft(\r\n\t\ttrig, \r\n\t\tfreq + (2 * (1 - skew) * cube_x), \r\n\t\t2 + (skew * 9), op2 * 3 * move, 0, 1, 0.25);\r\n\top0 = op(\r\n\t\ttrig, \r\n\t\tfreq, \r\n\t\t1, \r\n\t\t0.25 + op1 * 0.5 * (move * 0.5 + 0.5) + op3 * skew * 0.5, \r\n\t\t0, 0, 1\r\n\t);\r\n\t\r\n\treturn (op0 + op4) * 0.25 * amp_env;\r\n}\r\n\r\neuclid(metro, t, length, density, offset) {\r\n\tHistory trig;\r\n\t\r\n\tlength = round(length * 8) + 8;\r\n\tdensity = round(density * length);\r\n\toffset = round(offset * length);\r\n\tstep = ((t + length) - offset) * density;\r\n\t\r\n\tif (metro) {\r\n\t\ttrig = wrap(step, 0, length) < density;\r\n\t} else {\r\n\t\ttrig = 0;\r\n\t}\r\n\treturn trig;\r\n}\r\n\r\nHistory time, accent_count, hat_count, snare_count;\r\nBuffer \tplayhead(\"playhead\");\r\n\r\nParam \tdensity_outer, offset_outer, length_outer,\r\n\t\tdensity_inner, offset_inner, length_inner,\r\n\t\tline_move, line_skew, cube_x, cube_y, spring;\r\n\t\t\r\n\r\nmetro = delta(phasor(120 / 60 * 4)) < 0;\r\ntime += metro;\r\n\r\npoke(playhead, time, 0);\r\n\r\nsms = mstosamps(125);\r\ncx = fold(slide(cube_x, sms, sms), 0, 1);\r\ncy = fold(slide(cube_y, sms, sms), 0, 1);\r\n\r\ntrig0 = euclid(metro, time, length_outer, density_outer, offset_outer);\r\ntrig1 = euclid(metro, time, length_inner, density_inner, offset_inner);\r\ntrig3 = (metro * (trig0 + trig1) * 0.5) > 0.5;\r\ntrig2 = ((metro - (trig0 + trig1)) > 0) * !trig3;\r\n\r\naccent_eval = cx > 0.5 ? 5 : 6;\r\naccent_count = accent_count >= accent_eval ? 0 : accent_count + trig3;\r\n\r\nch_trig = accent_count % accent_eval ? trig3 : 0;\r\ncp_trig = accent_count % accent_eval ? 0 : trig3;\r\n\r\nsnare_count = snare_count >= 3 ? 0 : snare_count + trig1;\r\n\r\nrs_trig = trig1;\r\nsd_trig = 0;\r\n\r\nif (cube_x > 0.7) {\r\n\trs_trig = snare_count % 3 ? trig1 : 0;\r\n\tsd_trig = snare_count % 3 ? 0 : trig1;\r\n}\r\n\r\nbd = kick(trig0, cx, cy);\r\nrs = rim(rs_trig, trig0, cx, cy) * 2;\r\nsd = snare(sd_trig, cx, cy);\r\nhh = hat(trig2, line_skew, line_move, cx, cy) * 0.5;\r\ncp = clap(cp_trig, cx, cy) * 1.7;\r\n\r\nhat_count = hat_count >= 96 ? 0 : hat_count + trig2;\r\nsn = org(hat_count > 91 ? trig2 : 0, mtof(49 + 60 - (hat_count - 91) * 5));\r\n\r\nch_offset = 7;\r\n\r\nch = chord(ch_trig, -5 + ch_offset, line_skew, line_move, cx, cy);\r\nch += chord(ch_trig, 2 + ch_offset, line_skew, line_move, cx, cy);\r\nch += chord(ch_trig, 5 + ch_offset, line_skew, line_move, cx, cy);\r\nch += chord(ch_trig, 9 + ch_offset, line_skew, line_move, cx, cy);\r\nch += chord(ch_trig, 10 + ch_offset, line_skew, line_move, cx, cy);\r\n\r\nout_mix = bd + rs + hh + cp + ch + sd;\r\nout_mix = tanh(out_mix);\r\n\r\nspring_scaled = slide(spring, 512, 512);\r\nrev_size = (max(spring_scaled, 0.5) - 0.5);\r\n\r\nfx_l, fx_r = romb(ch + hh * 0.7 + sn, 0.5 + rev_size, 0.99, 0.4, 1);\r\n\r\nfx_l *= spring_scaled;\r\nfx_r *= spring_scaled;\r\n\r\nout1 = (fx_l * 5 + out_mix) * 0.7;\r\nout2 = (fx_r * 5 + out_mix) * 0.7;",
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
 ],
						"lines" : [ 							{
								"patchline" : 								{
									"destination" : [ "obj-5", 0 ],
									"source" : [ "obj-1", 0 ]
								}

							}
, 							{
								"patchline" : 								{
									"destination" : [ "obj-2", 0 ],
									"source" : [ "obj-5", 1 ]
								}

							}
, 							{
								"patchline" : 								{
									"destination" : [ "obj-3", 0 ],
									"source" : [ "obj-5", 0 ]
								}

							}
 ]
					}
,
					"patching_rect" : [ 135.0, 375.0, 36.0, 22.0 ],
					"text" : "gen~",
					"varname" : "dsp"
				}

			}
 ],
		"lines" : [ 			{
				"patchline" : 				{
					"destination" : [ "obj-10", 1 ],
					"source" : [ "obj-3", 1 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-10", 0 ],
					"source" : [ "obj-3", 0 ]
				}

			}
 ],
		"dependency_cache" : [ 			{
				"name" : "makesnd.js",
				"bootpath" : "~/Dev/fors/jsui-c74",
				"patcherrelativepath" : ".",
				"type" : "TEXT",
				"implicit" : 1
			}
 ],
		"autosave" : 0
	}

}
